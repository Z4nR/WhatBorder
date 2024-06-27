import {
  Controller,
  Post,
  Body,
  Patch,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto, AuthRegistDto, ChangePasswordDto } from './dto/auth.dto';
import { Public } from './decorator/public.decorator';
import { HelperService } from 'src/application/helper-service/helper.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly helperService: HelperService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async regist(@Body() registDto: AuthRegistDto) {
    if (registDto.password !== registDto.verify)
      throw new BadRequestException('Verifikasi Password Tidak Sesuai');
    return await this.authService.register(registDto);
  }

  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login')
  async login(@Body() loginDto: AuthLoginDto) {
    const username = loginDto.username;
    const password = loginDto.password;

    const parsePassword = this.helperService.decryptPassword(password);

    return await this.authService.login(username, parsePassword);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Patch('change-pass')
  async changePass(@Body() changePassDto: ChangePasswordDto) {
    if (changePassDto.newpass !== changePassDto.verify)
      throw new BadRequestException('Verifikasi Password Tidak Sesuai');

    return await this.authService.changePassword(changePassDto);
  }
}
