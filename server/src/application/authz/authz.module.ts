import { Module } from '@nestjs/common';
import { AuthzService } from './authz.service';
import { AuthzController } from './authz.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [AuthzController],
  providers: [AuthzService, PrismaService],
})
export class AuthzModule {}
