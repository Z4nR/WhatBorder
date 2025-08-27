import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Version,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegistDto } from './dto/create-auth.dto';
import { ChangePasswordDto } from './dto/update-auth.dto';
import { Public } from './decorator/public.decorator';
import { Role } from '../authz/enum/role.enum';
import { Roles } from '../authz/decorator/role.decorator';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from '../authz/authz.guard';

@UseGuards(AuthGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles(Role.USER, Role.ADMIN, Role.SUPER)
  @HttpCode(HttpStatus.OK)
  @Version('1')
  @Get('me')
  async user(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    const data = await this.authService.me(userId);
    return {
      username: data.username,
      exp: user.exp,
    };
  }

  @Roles(Role.USER, Role.ADMIN, Role.SUPER)
  @HttpCode(HttpStatus.OK)
  @Version('1')
  @Get('me-route')
  async userRole(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    const data = await this.authService.me(userId);
    return await this.authService.myRole(data.role);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Version('1')
  @Post('register')
  async regist(@Body() registDto: AuthRegistDto) {
    const password = registDto.password;
    const parsePassword = this.authService.decryptPassword(password);

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
  @Version('1')
  @Post('login')
  async login(@Body() loginDto: AuthLoginDto) {
    const password = loginDto.password;
    const parsePassword = this.authService.decryptPassword(password);

    const loginData: AuthLoginDto = {
      username: loginDto.username,
      password: parsePassword,
    };

    return this.authService.login(loginData);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Version('1')
  @Patch('change-pass')
  async changePass(@Body() changePassDto: ChangePasswordDto) {
    if (changePassDto.newpass !== changePassDto.verify)
      throw new BadRequestException('Verifikasi Password Tidak Sesuai');

    return this.authService.changePassword(changePassDto);
  }
}
