import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegistDto } from './dto/auth-regist.dto';
import { Public } from './decorator/public.decorator';

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
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: AuthLoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi Masalah Pada Server');
    }
  }
}
