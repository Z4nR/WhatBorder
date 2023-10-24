import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
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
    const userEmail = await this.userService.findByEmail(dto.email);
    if (userEmail) throw new ConflictException('email sudah digunakan');

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password, 10),
      },
    });

    const { password, ...user } = newUser;
    return user;
  }

  async login(dto: AuthLoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    const pw = await compare(dto.password, user.password);

    if (!pw)
      throw new UnauthorizedException(
        'password yang anda masukan tidak sesuai',
      );

    const payload = { sub: user.uuid, user: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get('SECRET'),
      }),
    };
  }
}
