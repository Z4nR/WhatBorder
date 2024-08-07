import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { VersionModule } from './application/version.module';
import { AuthGuard } from './application/auth/authentic/auth.guard';
import { ResponseTransformInterceptor } from './utils/helper/response-transform.interceptor';
import { camelCasedKey } from './utils/camel-cased';
import { RolesGuard } from './application/auth/authorize/role.guard';
import { HelperService } from './application/helper-service/helper.service';
import { PrismaService } from './db/prisma.service';

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
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    camelCasedKey,
    HelperService,
    PrismaService,
  ],
})
export class AppModule {}
