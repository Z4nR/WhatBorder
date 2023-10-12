import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(dto: AuthDto) {
    const user = await this.userService.findByEmail(dto.email);
    const pw = await compare(dto.password, user.password);

    if (user && pw) {
      const { password, ...data } = user;
      return data;
    }

    throw new UnauthorizedException();
  }
}
