import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { HelperService } from '../helper-service/helper.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [PlaceController],
  providers: [PlaceService, HelperService, PrismaService],
})
export class PlaceModule {}
