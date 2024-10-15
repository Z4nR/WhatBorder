import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  NotFoundException,
  Req,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HelperService } from '../helper-service/helper.service';
import { Request } from 'express';
import { Roles } from '../auth/authorize/decorator/role.decorator';
import { Role } from '../auth/authorize/enum/role.enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly helperService: HelperService,
  ) {}

  @Roles(Role.USER)
  @Get()
  async findAll(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;
    return await this.userService.findAll(userId);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(':id/detail')
  async findOne(@Param('id') id: string) {
    const userDetail = await this.helperService.findByIdUser(id);
    if (!userDetail) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return await this.userService.findOne(id);
  }

  @Roles(Role.USER)
  @Get('profile')
  async findMe(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    const findUser = await this.helperService.findByIdUser(userId);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return await this.userService.myProfile(userId);
  }

  @Roles(Role.USER)
  @Patch('update')
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req['user'];
    const userId = user.sub;

    const findUser = await this.helperService.findByIdUser(userId);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return await this.userService.update(userId, updateUserDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Delete('delete')
  async remove(@Req() req: Request, @Body() data: any) {
    const user = req['user'];
    const userId = user.sub;

    const findUser = await this.helperService.findByIdUser(userId);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');

    console.log(data);

    const { password } = data;

    return await this.userService.remove(userId, findUser.password, password);
  }
}
