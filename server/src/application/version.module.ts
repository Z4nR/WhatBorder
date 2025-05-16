import { AuthModule } from './auth/authentic/auth.module';
import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { WebsocketModule } from './websocket/websocket.module';
import { AuthorizeModule } from './auth/authorize/authorize.module';

@Module({
  imports: [
    AuthModule,
    AuthorizeModule,
    PlaceModule,
    UserModule,
    AdminModule,
    WebsocketModule,
  ],
})
export class VersionModule {}
