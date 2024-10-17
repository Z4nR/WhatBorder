import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { AuthLoginDto, AuthRegistDto, ChangePasswordDto } from './dto/auth.dto';
import { HelperService } from '../../helper-service/helper.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private helperService: HelperService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async me(id: string) {
    try {
      const data = await this.prisma.user.findFirst({
        select: {
          user_name: true,
          admin: true,
        },
        where: {
          user_id: id,
        },
      });

      return { username: data.user_name, role: data.admin };
    } catch (error) {
      console.log(error);
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
    const user = await this.helperService.findByUsername(dto.username);
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
    const username = await this.helperService.findByUsername(dto.username);
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

    const user = await this.helperService.findByUsername(dto.username);
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
