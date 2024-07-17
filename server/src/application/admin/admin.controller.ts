import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddBuildingDto } from './dto/create-admin.dto';
import { HelperService } from '../helper-service/helper.service';
import { Roles } from '../auth/authorize/decorator/role.decorator';
import { Role } from '../auth/authorize/enum/role.enum';
import { PlaceService } from '../place/place.service';
import { Request } from 'express';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly helperService: HelperService,
    private readonly placeService: PlaceService,
  ) {}

  @Post('building')
  create(@Body() buildingDto: AddBuildingDto, @Req() req: Request) {
    const user = req['user'].user;

    return this.adminService.addBuilding(buildingDto, user);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Delete(':id/remove/place')
  async removePlace(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    const findUser = await this.helperService.findByIdUser(userId);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');

    const findPlace = await this.placeService.findOne(id);
    if (!findPlace) throw new NotFoundException('Tempat Tidak Ditemukan');

    return await this.adminService.removePlace(id);
  }

  @Delete(':id/remove/user')
  async removeUser(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    const findUser = await this.helperService.findByIdUser(userId);
    if (!findUser) throw new NotFoundException('Pengguna Tidak Ditemukan');
    if (findUser.admin)
      throw new BadRequestException('Tidak Dapat Menghapus Sesama Admin');

    return this.adminService.removeUser(id);
  }
}
