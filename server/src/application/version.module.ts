import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { WebsocketModule } from './websocket/websocket.module';
import { AuthzModule } from './authz/authz.module';
import { AuthModule } from './auth/auth.module';
import { SuperAdminModule } from './super-admin/super-admin.module';

@Module({
  imports: [
    AuthModule,
    AuthzModule,
    PlaceModule,
    UserModule,
    AdminModule,
    WebsocketModule,
    SuperAdminModule,
  ],
})
export class VersionModule {}
