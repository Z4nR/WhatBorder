import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.userService.findByEmail(dto.email);
    const pw = await compare(dto.password, user.password);

    if (!pw) throw new UnauthorizedException();

    const payload = { sub: user.id, username: user.name };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('SECRET'),
      }),
    };
  }
}
