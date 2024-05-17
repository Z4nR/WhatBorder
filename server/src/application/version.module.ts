import { AuthModule } from './auth/authentic/auth.module';
import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, PlaceModule, UserModule, AdminModule],
})
export class VersionModule {}
