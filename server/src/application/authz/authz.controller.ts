import { Controller, Post, Body, Version } from '@nestjs/common';
import { AuthzService } from './authz.service';
import { CreateRoleDto } from './dto/create-authz.dto';

@Controller('authz')
export class AuthzController {
  constructor(private readonly authzService: AuthzService) {}

  @Version('1')
  @Post('role')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.authzService.createRole(createRoleDto);
  }
}
