import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HelperService } from '../helper-service/helper.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly helperService: HelperService,
  ) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('detail')
  async findOne(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    const userDetail = await this.helperService.findByIdUser(userId);
    if (!userDetail) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return await this.userService.findOne(userId);
  }

  @Get('profile')
  async findMe(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    const findUser = await this.helperService.findByIdUser(userId);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return await this.userService.myProfile(userId);
  }

  @Patch('update')
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req['user'];
    const userId = user.sub;

    const findUser = await this.helperService.findByIdUser(userId);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return await this.userService.update(userId, updateUserDto);
  }

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
