import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  user(@Request() req) {
    return req.user;
  }

  @Post()
  addPlace(@Body() placeDto) {
    return 'Todo';
  }

  @Get('/place')
  findAllPlace() {
    return this.userService.findAll();
  }

  @Get('/place/:id')
  findOne(@Param('id') id: string) {
    const user = this.userService.findById(+id);

    if (!user) throw new NotFoundException('data pengguna tidak ditemukan');

    return user;
  }

  @Patch('/place/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('/place/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
