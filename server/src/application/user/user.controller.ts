import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Req,
  Param,
  Version,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { Roles } from '../auth/authorize/decorator/role.decorator';
import { Role } from '../auth/authorize/enum/role.enum';
import { UserDelete } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.USER)
  @Version('1')
  @Get()
  async findAll(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;
    return this.userService.findAll(userId);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Version('1')
  @Get(':id/resume')
  async findOne(@Param('id') id: string) {
    await this.userService.validateUserAccount(id);

    return this.userService.findOne(id);
  }
  @Roles(Role.USER, Role.ADMIN)
  @Version('1')
  @Get(':id/detail')
  async findOther(@Param('id') id: string) {
    await this.userService.validateUserAccount(id);

    return this.userService.profile(id);
  }

  @Roles(Role.USER)
  @Version('1')
  @Get('profile')
  async findMe(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    await this.userService.validateUserAccount(userId);

    return this.userService.profile(userId);
  }

  @Roles(Role.USER)
  @Version('1')
  @Patch('update')
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req['user'];
    const userId = user.sub;

    await this.userService.validateUserAccount(userId);

    return this.userService.update(userId, updateUserDto);
  }

  @Roles(Role.USER)
  @Version('1')
  @Delete('delete')
  async remove(@Req() req: Request, @Body() data: UserDelete) {
    const user = req['user'];
    const userId = user.sub;

    const findUser = await this.userService.validateUserAccount(userId);

    return this.userService.remove(userId, findUser.password, data.password);
  }
}
