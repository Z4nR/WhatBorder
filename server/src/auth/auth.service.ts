import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/db/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegistDto } from './dto/auth-regist.dto';
import { ChangePasswordDto } from './dto/change-pw.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async changePassword(dto: ChangePasswordDto) {
    if (dto.newpass !== dto.verify)
      throw new BadRequestException('Verifikasi Password Tidak Sesuai');

    await this.prisma.user.update({
      where: {
        username: dto.username,
      },
      data: {
        password: await hash(dto.newpass, 10),
      },
    });

    return { message: 'Kata Sandi Berhasil Dirubah' };
  }

  async register(dto: AuthRegistDto) {
    if (dto.password !== dto.verify)
      throw new BadRequestException('Verifikasi Password Tidak Sesuai');

    const username = await this.userService.findByUsername(dto.username);
    if (username) throw new ConflictException('Nama Pengguna sudah digunakan');

    await this.prisma.user.create({
      data: {
        username: dto.username,
        fullname: dto.fullname,
        password: await hash(dto.password, 10),
      },
    });

    return { message: 'Akun berhasil dibuat' };
  }

  async login(dto: AuthLoginDto) {
    const user = await this.userService.findByUsername(dto.username);
    if (!user) throw new NotFoundException('Nama Pengguna tidak diketahui');

    const pw = await compare(dto.password, user.password);
    if (!pw)
      throw new UnauthorizedException(
        'Kata sandi yang anda masukan tidak sesuai',
      );

    const payload = {
      sub: user.uuid,
      user: user.username,
      role: user.admin,
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('SECRET'),
        expiresIn: '6h',
      }),
    };
  }
}
