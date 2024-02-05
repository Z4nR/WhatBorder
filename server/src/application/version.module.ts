import { AuthModule } from './auth/auth.module';
import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, PlaceModule, UserModule],
})
export class VersionModule {}
