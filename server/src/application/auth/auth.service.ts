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
import { AuthRegistDto, ChangePasswordDto } from './dto/auth.dto';
import { HelperService } from '../helper-service/helper.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private helperService: HelperService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createToken(payload: any) {
    try {
      return await this.jwtService.signAsync(payload, {
        secret: this.configService.get('SECRET'),
        expiresIn: '12h',
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

      return await this.login(dto.username, dto.password);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async login(username: string, password: string) {
    const user = await this.helperService.findByUsername(username);
    if (!user) throw new NotFoundException('Nama Pengguna tidak diketahui');

    const pw = await compare(password, user.password);
    if (!pw)
      throw new UnauthorizedException(
        'Kata sandi yang anda masukan tidak sesuai',
      );

    try {
      const payload = {
        sub: user.user_id,
        user: user.user_name,
        role: user.admin,
        id: randomUUID(),
      };

      const createToken = await this.createToken(payload);

      const data = {
        accessToken: createToken,
        message: `Selamat Datang ${username}`,
      };

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
