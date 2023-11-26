import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StatService } from './stat.service';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @Get('place-all')
  findAllPlace() {
    try {
      return this.statService.findAllPlace();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get(':id/detail-place')
  findOnePlace(@Param('id') id: string) {
    try {
      const data = this.statService.findOnePlace(id);
      if (!data) throw new NotFoundException('Data tempat tidak ditemukan');
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get('user-all')
  findAllUser() {
    try {
      return this.statService.findAllUser();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Get(':id/detail-user')
  findOneUser(@Param('id') id: string) {
    try {
      return this.statService.findOneUser(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }
}
