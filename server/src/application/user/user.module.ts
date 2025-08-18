import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/db/prisma.service';
import { AuthzService } from '../authz/authz.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthzService],
})
export class UserModule {}
