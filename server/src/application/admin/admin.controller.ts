import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Version,
  UseGuards,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddBuildingDto } from './dto/create-admin.dto';
import { Request } from 'express';
import { Roles } from '../authz/decorator/role.decorator';
import { Role } from '../authz/enum/role.enum';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../authz/authz.guard';
import { UpdateBuildingDto } from './dto/update-admin.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.ADMIN, Role.SUPER)
  @Version('1')
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Roles(Role.ADMIN, Role.SUPER)
  @Version('1')
  @Post('building')
  createBuilding(@Body() buildingDto: AddBuildingDto, @Req() req: Request) {
    const user = req['user'].user;

    return this.adminService.createBuilding(buildingDto, user);
  }

  @Roles(Role.ADMIN, Role.SUPER)
  @Version('1')
  @Put('building/:id')
  updateBuilding(
    @Param('id') id: number,
    @Body() buildingDto: UpdateBuildingDto,
    @Req() req: Request,
  ) {
    const user = req['user'].user;

    return this.adminService.updateBuilding(id, buildingDto, user);
  }

  @Roles(Role.ADMIN, Role.SUPER)
  @Version('1')
  @Delete('building/:id')
  removeBuilding(@Param('id') id: number) {
    return this.adminService.removeBuilding(id);
  }

  @Roles(Role.ADMIN)
  @Version('1')
  @Get('user-status')
  findUserStatus() {
    return this.adminService.findUserStatus();
  }

  @Roles(Role.ADMIN)
  @Version('1')
  @Delete(':id/remove/place')
  async removePlace(@Param('id') id: string) {
    console.log(`Removing place with id: ${id}`);
    return this.adminService.removePlace(id);
  }

  @Roles(Role.ADMIN)
  @Version('1')
  @Delete(':id/inactive/user')
  async inactiveUser(@Param('id') id: string) {
    console.log(`Inactivated user with id: ${id}`);
    return this.adminService.inactiveUser(id);
  }
}
