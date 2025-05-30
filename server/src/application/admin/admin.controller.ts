import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Patch,
  Version,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddBuildingDto } from './dto/create-admin.dto';
import { Request } from 'express';
import { Roles } from '../authz/decorator/role.decorator';
import { Role } from '../authz/enum/role.enum';

@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Version('1')
  @Post('building')
  create(@Body() buildingDto: AddBuildingDto, @Req() req: Request) {
    const user = req['user'].user;

    return this.adminService.addBuilding(buildingDto, user);
  }

  @Version('1')
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Version('1')
  @Get('user-only')
  findUserOnly() {
    return this.adminService.findUserOnly();
  }

  @Version('1')
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

  @Version('1')
  @Delete(':id/remove/place')
  async removePlace(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    await this.adminService.validateUserAccount(userId);
    await this.adminService.validatePlaceData(id);

    return this.adminService.removePlace(id);
  }

  @Version('1')
  @Delete(':id/remove/user')
  async removeUser(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    await this.adminService.validateUserAccount(userId);
    return this.adminService.removeUser(id);
  }
}
