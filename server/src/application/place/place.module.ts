import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { HelperService } from '../helper-service/helper.service';
import { AuthzService } from '../authz/authz.service';

@Module({
  controllers: [PlaceController],
  providers: [PlaceService, AuthzService, HelperService],
})
export class PlaceModule {}
