import { Module } from '@nestjs/common';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { PrismaService } from 'src/db/prisma.service';
import { PlaceService } from 'src/place/place.service';

@Module({
  controllers: [StatController],
  providers: [StatService, PrismaService, PlaceService],
})
export class StatModule {}
