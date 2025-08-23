import { Controller, Post, Body, Version, UseGuards } from '@nestjs/common';
import { AuthzService } from './authz.service';
import { CreateRoleDto } from './dto/create-authz.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from './authz.guard';
import { Roles } from './decorator/role.decorator';
import { Role } from './enum/role.enum';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER)
@Controller('authz')
export class AuthzController {
  constructor(private readonly authzService: AuthzService) {}

  @Version('1')
  @Post('role')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.authzService.createRole(createRoleDto);
  }
}
