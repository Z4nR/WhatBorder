import { Module } from '@nestjs/common';
import { AuthzService } from './authz.service';
import { AuthzController } from './authz.controller';

@Module({
  controllers: [AuthzController],
  providers: [AuthzService],
})
export class AuthzModule {}
