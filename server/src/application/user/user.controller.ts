import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
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

    try {
      const data = await this.userService.me(user.sub);
      return {
        ...data,
        exp: user.exp,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id/detail')
  async findOne(@Param('id') id: string) {
    const user = await this.helperService.findByIdUser(id);
    if (!user) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return this.userService.findOne(id);
  }

  @Get('profile')
  async findMe(@Req() req: Request) {
    const user = req['user'];
    const id = user.sub;

    const findUser = await this.helperService.findByIdUser(id);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return this.userService.myProfile(id);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Patch('update')
  async update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req['user'];
    const id = user.sub;

    const findUser = await this.helperService.findByIdUser(id);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return await this.userService.update(id, updateUserDto);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Delete('delete')
  async remove(@Req() req: Request, @Body() data: any) {
    const user = req['user'];
    const id = user.sub;

    const findUser = await this.helperService.findByIdUser(id);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');

    console.log(data);

    const { password } = data;

    return await this.userService.remove(id, findUser.password, password);
  }
}
