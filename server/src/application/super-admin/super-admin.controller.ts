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
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import {
  CreateMenuPathDto,
  CreateRoleAccessMenuDto,
} from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
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
  @Post('menu-path')
  createMenuPath(@Body() createMenuPathDto: CreateMenuPathDto) {
    return this.superAdminService.createMenuPath(createMenuPathDto);
  }

  @Version('1')
  @Post('menu-role')
  createRoleMenu(@Body() createRoleAccessMenuDto: CreateRoleAccessMenuDto) {
    return this.superAdminService.createRoleAccessMenu(createRoleAccessMenuDto);
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
}
