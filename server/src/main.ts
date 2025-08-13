import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const origin = process.env.ORIGIN.split(', ');

  if (process.env.NODE_ENV === 'development') {
    console.log(origin);
  }

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.NODE_ENV === 'development' ? '*' : origin,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(5555);
}
bootstrap();
