import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Version,
} from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Request } from 'express';
import { Role } from '../authz/enum/role.enum';
import { Roles } from '../authz/decorator/role.decorator';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  // All Access
  @Roles(Role.USER, Role.ADMIN)
  @Version('1')
  @Get('building-filter')
  async findAllBuilding() {
    return this.placeService.findBuilding();
  }

  @Roles(Role.USER, Role.ADMIN)
  @Version('1')
  @Get()
  async findAll() {
    return this.placeService.findAll();
  }

  @Roles(Role.USER, Role.ADMIN)
  @Version('1')
  @Get(':id/detail')
  async findOne(@Param('id') id: string) {
    return this.placeService.findOne(id);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Version('1')
  @Get(':id/compare-list')
  async compareList(@Param('id') id: string) {
    return this.placeService.compareList(id);
  }

  // User Access
  @Roles(Role.USER)
  @Version('1')
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
  @Version('1')
  @Get('statistic/user')
  async showStatisticUser(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;
    return this.placeService.statisticUser(userId);
  }

  @Roles(Role.USER)
  @Version('1')
  @Get('my-list')
  async findMyPlace(@Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;
    return this.placeService.findPlaceUser(userId);
  }

  @Roles(Role.USER)
  @Version('1')
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
  @Version('1')
  @Delete(':id/remove')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    const userId = user.sub;

    return this.placeService.remove(id, userId);
  }

  // Admin Access
  @Roles(Role.ADMIN)
  @Version('1')
  @Get('admin-access')
  async adminPlaceData() {
    return this.placeService.adminPlaceList();
  }

  @Roles(Role.ADMIN)
  @Version('1')
  @Get('statistic/admin')
  async showStatisticAdmin() {
    return this.placeService.statisticAdmin();
  }

  @Roles(Role.ADMIN)
  @Version('1')
  @Get('my-list')
  async findAllPlace() {
    return this.placeService.findPlaceAdmin();
  }
}
