import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegistDto } from './dto/auth-regist.dto';
import { Public } from './decorator/public.decorator';
import { ChangePasswordDto } from './dto/change-pw.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  regist(@Body() registDto: AuthRegistDto) {
    try {
      return this.authService.register(registDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi Masalah Pada Server');
    }
  }

  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login')
  login(@Body() loginDto: AuthLoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi Masalah Pada Server');
    }
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Patch('change-pass')
  changePass(@Body() changePassDto: ChangePasswordDto) {
    try {
      return this.authService.changePassword(changePassDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi Masalah Pada Server');
    }
  }
}
