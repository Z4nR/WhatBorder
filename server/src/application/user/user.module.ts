import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HelperService } from '../helper-service/helper.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, HelperService, PrismaService],
})
export class UserModule {}
