import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { HelperService } from '../helper-service/helper.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private helperService: HelperService,
  ) {}

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
  async findMe(@Request() req: any) {
    const id = req.user.sub;

    const user = await this.helperService.findByIdUser(id);
    if (!user) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return this.userService.myProfile(id);
  }

  @Patch('update')
  async update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user.sub;

    const user = await this.helperService.findByIdUser(id);
    if (!user) throw new NotFoundException('Pengguna Tidak Ditemukan');

    return await this.userService.update(id, updateUserDto);
  }

  @Delete('delete')
  async remove(@Request() req: any, @Body() data: any) {
    const id = req.user.sub;

    const user = await this.helperService.findByIdUser(id);
    if (!user) throw new NotFoundException('Pengguna Tidak Ditemukan');

    console.log(data, typeof data);
    const { password } = data;

    return await this.userService.remove(id, user.password, password);
  }
}
