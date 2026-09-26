import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Version,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateMenuPathDto } from './dto/create-super-admin.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../authz/authz.guard';
import { Roles } from '../authz/decorator/role.decorator';
import { Role } from '../authz/enum/role.enum';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.SUPER)
@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Version('1')
  @Post('menu-role')
  createMenuPath(@Body() createMenuPathDto: CreateMenuPathDto) {
    return this.superAdminService.createMenuPath(createMenuPathDto);
  }

  @Version('1')
  @Get('menu-list')
  findAllMenu() {
    return this.superAdminService.getAllMenu();
  }

  @Version('1')
  @Get('menu-list/:role')
  findAllRouteForRole(@Param('role', ParseIntPipe) role: number) {
    const roleData = role ? role : null;
    console.log('checkRole', role, roleData);

    return this.superAdminService.getRoleRouteList(roleData);
  }

  @Version('1')
  @Get('role-list')
  findAllRole() {
    return this.superAdminService.getAllRole();
  }

  @Version('1')
  @Get('user-role')
  findUserRole() {
    return this.superAdminService.findUserRole();
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

    await this.superAdminService.validateAdminStatus(userId);

    return this.superAdminService.updateUserRole(id, body);
  }

  @Version('1')
  @Delete(':id/active-status/user')
  async inactiveUser(@Param('id') id: string) {
    console.log(`Change user active status with id: ${id}`);
    return this.superAdminService.activeStatusUser(id);
  }

  @Version('1')
  @Delete(':id/remove/user')
  async removeUser(@Param('id') id: string) {
    console.log(`Removing user with id: ${id}`);
    return this.superAdminService.removeUser(id);
  }
}
