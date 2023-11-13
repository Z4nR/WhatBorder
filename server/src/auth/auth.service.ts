import {
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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: AuthRegistDto) {
    const username = await this.userService.findByUsername(dto.username);
    if (username) throw new ConflictException('Nama Pengguna sudah digunakan');

    await this.prisma.user.create({
      data: {
        ...dto,
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
    };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('SECRET'),
      }),
    };
  }
}
