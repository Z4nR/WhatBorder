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
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddBuildingDto } from './dto/create-admin.dto';
import { Request } from 'express';
import { Roles } from '../authz/decorator/role.decorator';
import { Role } from '../authz/enum/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../authz/authz.guard';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Version('1')
  @Post('building')
  createBuilding(@Body() buildingDto: AddBuildingDto, @Req() req: Request) {
    const user = req['user'].user;

    return this.adminService.createBuilding(buildingDto, user);
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
  @Delete('building/:id')
  removeBuilding(@Param('id') id: number) {
    return this.adminService.removeBuilding(id);
  }

  @Version('1')
  @Delete(':id/remove/place')
  async removePlace(@Param('id') id: string) {
    await this.adminService.validatePlaceData(id);

    console.log(`Removing place with id: ${id}`);
    // return this.adminService.removePlace(id);
  }

  @Version('1')
  @Delete(':id/remove/user')
  async removeUser(@Param('id') id: string) {
    await this.adminService.validateUserAccount(id);

    console.log(`Removing user with id: ${id}`);
    // return this.adminService.removeUser(id);
  }
}
