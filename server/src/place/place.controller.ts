import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  InternalServerErrorException,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createPlaceDto: CreatePlaceDto, @Request() req: any) {
    try {
      const id = req.user.sub;
      return this.placeService.create(id, createPlaceDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @Get('place-list')
  findAll() {
    return this.placeService.findAll();
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @Get(':id/detail')
  findOne(@Param('id') id: string) {
    try {
      const data = this.placeService.findOne(id);
      if (!data) throw new NotFoundException('Data tempat tidak ditemukan');
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(':id/update')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    try {
      return this.placeService.update(id, updatePlaceDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id/delete')
  remove(@Param('id') id: string) {
    return this.placeService.remove(id);
  }
}
