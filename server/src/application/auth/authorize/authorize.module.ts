import { Module } from '@nestjs/common';
import { AuthorizeService } from './authorize.service';
import { AuthorizeController } from './authorize.controller';

@Module({
  controllers: [AuthorizeController],
  providers: [AuthorizeService],
})
export class AuthorizeModule {}
