import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Roles } from '../auth/authorize/decorator/role.decorator';
import { Role } from '../auth/authorize/enum/role.enum';
import { Request } from 'express';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  // All Access
  @Roles(Role.USER, Role.ADMIN)
  @Get('building-filter')
  async findAllBuilding() {
    return this.placeService.findBuilding();
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get()
  async findAll() {
    return this.placeService.findAll();
  }

  @Roles(Role.USER, Role.ADMIN)
  @Get(':id/detail')
  async findOne(@Param('id') id: string) {
    return this.placeService.findOne(id);
  }

  // User Access
  @Roles(Role.USER)
  @Post()
  async create(@Req() req: Request, @Body() createPlaceDto: CreatePlaceDto) {
    const user = req['user'];
    const userId = user.sub;
    const name = user.user;

    await this.placeService.validatePlaceExist(
      createPlaceDto.placeName,
      createPlaceDto.placeGeojson,
    );

    return this.placeService.create(userId, name, createPlaceDto);
  }

  @Roles(Role.USER)
  @Get('statistic/user')
  async showStatisticUser(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;
    return this.placeService.statisticUser(userId);
  }

  @Roles(Role.USER)
  @Get('my-list')
  async findMyPlace(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;
    return this.placeService.findPlace(userId);
  }

  @Roles(Role.USER)
  @Get(':id/compare-list')
  async compareList(@Param('id') id: string) {
    return this.placeService.compareList(id);
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

    return this.placeService.update(id, userId, userName, updatePlaceDto);
  }

  @Roles(Role.USER)
  @Delete(':id/remove')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    return this.placeService.remove(id, userId);
  }

  // Admin Access
  @Roles(Role.ADMIN)
  @Get('admin-access')
  async adminPlaceData() {
    return this.placeService.adminPlaceList();
  }

  @Roles(Role.ADMIN)
  @Get('statistic/admin')
  async showStatisticAdmin() {
    return this.placeService.statisticAdmin();
  }
}
