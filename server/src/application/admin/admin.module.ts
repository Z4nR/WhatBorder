import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { HelperService } from '../helper-service/helper.service';
import { PlaceService } from '../place/place.service';
import { AuthzService } from '../authz/authz.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, AuthzService, HelperService, PlaceService],
})
export class AdminModule {}
