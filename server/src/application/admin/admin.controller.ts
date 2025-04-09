import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddBuildingDto } from './dto/create-admin.dto';
import { Roles } from '../auth/authorize/decorator/role.decorator';
import { Role } from '../auth/authorize/enum/role.enum';
import { Request } from 'express';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('building')
  create(@Body() buildingDto: AddBuildingDto, @Req() req: Request) {
    const user = req['user'].user;

    return this.adminService.addBuilding(buildingDto, user);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get('user-only')
  findUserOnly() {
    return this.adminService.findUserOnly();
  }

  @Patch('change-role/:id')
  async updateUserOnly(
    @Param('id') id: string,
    @Body() body: { admin: boolean },
    @Req() req: Request,
  ) {
    const user = req['user'];
    const userId = user.sub;

    await this.adminService.validateRulerAccount(userId);
  }

  @Delete(':id/remove/place')
  async removePlace(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    await this.adminService.validateUserAccount(userId);
    await this.adminService.validatePlaceData(id);

    return this.adminService.removePlace(id);
  }

  @Delete(':id/remove/user')
  async removeUser(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    await this.adminService.validateUserAccount(userId);
    return this.adminService.removeUser(id);
  }
}
