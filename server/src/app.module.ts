import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { VersionModule } from './application/version.module';
import { AuthGuard } from './application/auth/auth.guard';
import { ResponseTransformInterceptor } from './utils/helper/response-transform.interceptor';
import { camelCasedKey } from './utils/camel-cased';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    VersionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    camelCasedKey,
  ],
})
export class AppModule {}
