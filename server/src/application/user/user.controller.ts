import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Req,
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

  @HttpCode(HttpStatus.OK)
  @Get('me')
  async user(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    const data = await this.userService.me(userId);
    return {
      ...data,
      exp: user.exp,
    };
  }

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

  @Roles(Role.USER, Role.ADMIN)
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
