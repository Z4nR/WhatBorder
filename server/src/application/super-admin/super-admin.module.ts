import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { AuthzService } from '../authz/authz.service';

@Module({
  controllers: [SuperAdminController],
  providers: [SuperAdminService, AuthzService],
})
export class SuperAdminModule {}
