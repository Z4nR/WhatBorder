import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Req,
  Param,
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
  @Get()
  async findAll(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;
    return await this.userService.findAll(userId);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(':id/resume')
  async findOne(@Param('id') id: string) {
    await this.userService.validateUserAccount(id);

    return await this.userService.findOne(id);
  }
  @Roles(Role.USER, Role.ADMIN)
  @Get(':id/detail')
  async findOther(@Param('id') id: string) {
    await this.userService.validateUserAccount(id);

    return await this.userService.profile(id);
  }

  @Roles(Role.USER)
  @Get('profile')
  async findMe(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    await this.userService.validateUserAccount(userId);

    return await this.userService.profile(userId);
  }

  @Roles(Role.USER)
  @Patch('update')
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req['user'];
    const userId = user.sub;

    await this.userService.validateUserAccount(userId);

    return await this.userService.update(userId, updateUserDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Delete('delete')
  async remove(@Req() req: Request, @Body() data: UserDelete) {
    const user = req['user'];
    const userId = user.sub;

    const findUser = await this.userService.validateUserAccount(userId);

    return await this.userService.remove(
      userId,
      findUser.password,
      data.password,
    );
  }
}
