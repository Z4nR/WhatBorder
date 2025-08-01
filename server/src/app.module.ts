import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { VersionModule } from './application/version.module';
import { ResponseTransformInterceptor } from './utils/helper/response-transform.interceptor';
import { camelCasedKey } from './utils/camel-cased';
import { HelperService } from './application/helper-service/helper.service';
import { PrismaService } from './db/prisma.service';
import { AuthGuard } from './application/auth/auth.guard';
import { RolesGuard } from './application/authz/authz.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    VersionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
