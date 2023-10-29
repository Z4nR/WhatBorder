import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { PrismaService } from 'src/db/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [PlaceController],
  providers: [PlaceService, PrismaService, UserService],
})
export class PlaceModule {}
