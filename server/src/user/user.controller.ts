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
  Next,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('test')
  user(@Request() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Get('place-data')
  findPlace(@Request() req: any) {
    const id = req.user.sub;
    return this.userService.findPlaceData(id);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get()
  findAllPlace() {
    return this.userService.findAll();
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const user = this.userService.findById(+id);

    if (!user) throw new NotFoundException('data pengguna tidak ditemukan');

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
