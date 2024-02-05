import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  Request,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { HelperService } from '../helper-service/helper.service';

@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private helperService: HelperService,
  ) {}

  @Post()
  async create(@Request() req: any, @Body() createPlaceDto: CreatePlaceDto) {
    const id = req.user.sub;
    const name = req.user.user;

    const place = await this.helperService.checkingPlace(
      createPlaceDto.placeGeojson,
    );
    if (place)
      throw new ConflictException('Lokasi sudah ditambahkan oleh orang lain');

    return await this.placeService.create(id, name, createPlaceDto);
  }

  @Get()
  async findAll() {
    return await this.placeService.findAll();
  }

  @Get('my-list')
  async findMyPlace(@Request() req: any) {
    const userId = req.user.sub;
    return this.placeService.findPlace(userId);
  }

  @Get(':id/detail')
  async findOne(@Param('id') id: string) {
    return await this.placeService.findOne(id);
  }

  @Patch(':id/update')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    const userId = req.user.sub;
    return this.placeService.update(+id, updatePlaceDto);
  }

  @Delete(':id/remove')
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.sub;

    return await this.placeService.remove(id, userId);
  }
}
