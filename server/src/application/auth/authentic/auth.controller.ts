import {
  Controller,
  Post,
  Body,
  Patch,
  HttpStatus,
  HttpCode,
  BadRequestException,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegistDto, ChangePasswordDto } from './dto/auth.dto';
import { Public } from './decorator/public.decorator';
import { HelperService } from 'src/application/helper-service/helper.service';
import { Roles } from '../authorize/decorator/role.decorator';
import { Role } from '../authorize/enum/role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly helperService: HelperService,
  ) {}

  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async user(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    const data = await this.authService.me(userId);
    return {
      ...data,
      exp: user.exp,
    };
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async regist(@Body() registDto: AuthRegistDto) {
    const password = registDto.password;
    const parsePassword = this.helperService.decryptPassword(password);

    console.log(parsePassword);

    if (parsePassword !== registDto.verify)
      throw new BadRequestException('Verifikasi Password Tidak Sesuai');

    const registData: AuthRegistDto = {
      username: registDto.username,
      fullname: registDto.fullname,
      password: parsePassword,
      verify: registDto.verify,
      code: registDto.code,
    };

    return this.authService.register(registData);
  }

  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login')
  async login(@Body() loginDto: AuthLoginDto) {
    const password = loginDto.password;
    const parsePassword = this.helperService.decryptPassword(password);

    const loginData: AuthLoginDto = {
      username: loginDto.username,
      password: parsePassword,
    };

    return this.authService.login(loginData);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Patch('change-pass')
  async changePass(@Body() changePassDto: ChangePasswordDto) {
    if (changePassDto.newpass !== changePassDto.verify)
      throw new BadRequestException('Verifikasi Password Tidak Sesuai');

    return this.authService.changePassword(changePassDto);
  }
}
