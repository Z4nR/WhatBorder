import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  Req,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { HelperService } from '../helper-service/helper.service';
import { Roles } from '../auth/authorize/decorator/role.decorator';
import { Role } from '../auth/authorize/enum/role.enum';
import { Request } from 'express';

@Controller('place')
export class PlaceController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly helperService: HelperService,
  ) {}

  @Roles(Role.USER)
  @Post()
  async create(@Req() req: Request, @Body() createPlaceDto: CreatePlaceDto) {
    const user = req['user'];
    const userId = user.sub;
    const name = user.user;

    const place = await this.helperService.checkingPlaceName(
      createPlaceDto.placeName,
    );
    if (place)
      throw new ConflictException(
        'Nama tempat sudah ditambahkan oleh orang lain',
      );

    const map = await this.helperService.checkingPlaceMap(
      createPlaceDto.placeGeojson,
    );
    if (map)
      throw new ConflictException('Lokasi sudah ditambahkan oleh orang lain');

    return await this.placeService.create(userId, name, createPlaceDto);
  }

  @Get()
  async findAll() {
    return await this.placeService.findAll();
  }

  @Roles(Role.USER)
  @Get('statistic')
  async showStatistic(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;
    return await this.placeService.statistic(userId);
  }

  @Get('my-list')
  async findMyPlace(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;
    return await this.placeService.findPlace(userId);
  }

  @Get(':id/detail')
  async findOne(@Param('id') id: string) {
    return await this.placeService.findOne(id);
  }

  @Roles(Role.USER)
  @Patch(':id/update')
  async update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    const user = req['user'];
    const userId = user.sub;
    const userName = user.user;

    return await this.placeService.update(id, userId, userName, updatePlaceDto);
  }

  @Roles(Role.USER)
  @Delete(':id/remove')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    return await this.placeService.remove(id, userId);
  }
}
