import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  user(@Request() req: any) {
    try {
      return {
        username: req.user.user,
        role: req.user.role,
        exp: req.user.exp,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get('place-data')
  findPlace(@Request() req: any) {
    try {
      const id = req.user.sub;
      return this.userService.findPlaceData(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get('user-list')
  searchUser(@Query('name') name: string) {
    try {
      return this.userService.findAll(name);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get('detail')
  findOne(@Request() req: any) {
    try {
      const id = req.user.sub;
      return this.userService.findOne(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.OK)
  @Patch('update')
  update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    try {
      const id = req.user.sub;
      return this.userService.update(id, updateUserDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete('delete')
  remove(@Request() req: any, @Body() data: any) {
    try {
      const id = req.user.sub;
      const { password } = data;

      return this.userService.remove(id, password);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }
}
