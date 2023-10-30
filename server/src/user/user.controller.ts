import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  user(@Request() req: any) {
    try {
      return {
        id: req.user.sub,
        username: req.user.user,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @UseGuards(AuthGuard)
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
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
