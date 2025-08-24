import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginDto, AuthRegistDto } from './dto/create-auth.dto';
import { ChangePasswordDto } from './dto/update-auth.dto';
import { randomUUID } from 'crypto';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/db/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HelperService } from '../helper-service/helper.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helperService: HelperService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async findByUsername(username: string) {
    try {
      const data = await this.prisma.user.findFirst({
        where: {
          user_name: username,
        },
      });

      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  decryptPassword(password: string) {
    return this.helperService.decryptPassword(password);
  }

  async me(id: string) {
    try {
      const data = await this.prisma.user.findFirst({
        select: {
          user_name: true,
          role_code: true,
        },
        where: {
          user_id: id,
        },
      });

      return { username: data.user_name, role: data.role_code };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async myRole(id: number) {
    try {
      const role = await this.prisma.role.findFirst({
        where: { role_code: id },
        select: {
          RoleRoute: {
            select: {
              route: {
                select: {
                  route_id: true,
                  route_name: true,
                  path_route: true,
                  path_side: true,
                  path_key: true,
                  order_path: true,
                  parent_id: true,
                  parent: {
                    select: {
                      path_key: true,
                    },
                  },
                  children: {
                    select: {
                      route_id: true,
                      route_name: true,
                      path_route: true,
                      path_side: true,
                      path_key: true,
                      order_path: true,
                      parent_id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const routes =
        role?.RoleRoute.map((rr) => ({
          routeId: rr.route.route_id,
          routeName: rr.route.route_name,
          path: rr.route.path_route,
          side: rr.route.path_side,
          pathKey: rr.route.path_key,
          orderPath: rr.route.order_path,
          parentId: rr.route.parent_id,
          parentKey: rr.route.parent?.path_key ?? null, // 👈 flattened
          children: rr.route.children.map((c) => ({
            routeId: c.route_id,
            pathKey: c.path_key,
          })),
        })) ?? [];

      // Build a lookup map for quick parent-child assignment
      const map = new Map<string, any>();
      routes.forEach((r) => {
        map.set(r.routeId, { ...r, children: [] });
      });

      const treeRoute: any[] = [];
      map.forEach((route) => {
        if (route.parentId && map.has(route.parentId)) {
          map.get(route.parentId).children.push(route);
        } else {
          treeRoute.push(route);
        }
      });

      return treeRoute;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createToken(payload: any) {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: this.configService.get('SECRET'),
        expiresIn: this.configService.get('SECRETEXPIRED'),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async changePassword(dto: ChangePasswordDto) {
    const user = await this.findByUsername(dto.username);
    if (!user) throw new NotFoundException('Nama Pengguna tidak diketahui');

    const code = await compare(dto.code, user.special_code);
    if (!code)
      throw new BadRequestException('Kode yang anda masukan tidak sesuai');

    try {
      await this.prisma.user.update({
        where: {
          user_name: dto.username,
        },
        data: {
          password: await hash(dto.newpass, 10),
        },
      });

      return { message: 'Kata Sandi Berhasil Dirubah' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async register(dto: AuthRegistDto) {
    const username = await this.findByUsername(dto.username);
    if (username) throw new ConflictException('Nama Pengguna sudah digunakan');

    try {
      await this.prisma.user.create({
        data: {
          user_name: dto.username,
          full_name: dto.fullname,
          special_code: await hash(dto.code, 10),
          password: await hash(dto.password, 10),
        },
      });

      return await this.login(dto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(dto: AuthLoginDto) {
    const date = new Date().toISOString();

    const user = await this.findByUsername(dto.username);
    if (!user) throw new NotFoundException('Nama Pengguna tidak diketahui');

    await this.prisma.user.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        login_at: date,
      },
    });

    const pw = await compare(dto.password, user.password);
    if (!pw)
      throw new UnauthorizedException(
        'Kata sandi yang anda masukan tidak sesuai',
      );

    try {
      const payload = {
        sub: user.user_id,
        user: user.user_name,
        id: randomUUID(),
      };

      const createToken = await this.createToken(payload);

      const data = {
        accessToken: createToken,
        message: `Selamat Datang ${dto.username}`,
      };

      return data;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Maaf terjadi kesalahan ketika berusaha masuk',
      );
    }
  }
}
