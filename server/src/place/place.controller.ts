import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  InternalServerErrorException,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

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

  @HttpCode(HttpStatus.OK)
  @Patch(':id/update')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    try {
      const userId = req.user.sub;
      return this.placeService.update(userId, id, updatePlaceDto);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id/delete')
  remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.placeService.remove(userId, id);
  }

  //All Place List
  @HttpCode(HttpStatus.ACCEPTED)
  @Get()
  findAll() {
    try {
      return this.placeService.findAll();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Terjadi masalah pada server');
    }
  }

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
}
