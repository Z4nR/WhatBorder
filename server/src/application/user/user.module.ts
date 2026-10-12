import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthzService } from '../authz/authz.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthzService],
})
export class UserModule {}
