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
  Param,
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

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  profile(@Request() req: any) {
    try {
      const id = req.user.sub;
      return this.userService.myProfile(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get('place-view')
  getGeoJson(@Request() req: any) {
    try {
      const id = req.user.sub;
      return this.userService.showGeoJson(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get('search')
  searchUser(@Query('name') name: string) {
    try {
      return this.userService.findAll(name);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get(':id/detail')
  findOne(@Param('id') id: string) {
    try {
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
