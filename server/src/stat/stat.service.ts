import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { PlaceService } from 'src/place/place.service';

@Injectable()
export class StatService {
  constructor(
    private prisma: PrismaService,
    private placeService: PlaceService,
  ) {}

  async findAllPlace() {
    const placeList = await this.prisma.geoData.findMany({
      select: {
        uuid: true,
        placeName: true,
        placeAddress: true,
        createdAt: true,
        user: {
          select: {
            uuid: true,
            fullname: true,
          },
        },
      },
    });

    if (placeList.length === 0)
      throw new NotFoundException('Data tempat tidak ditemukan');

    return placeList;
  }

  async findOnePlace(uuid: string) {
    const data = await this.placeService.findByIdPlace(uuid);
    if (!data) throw new NotFoundException('Data tempat tidak ditemukan');

    return await this.prisma.geoData.findUnique({
      select: {
        placeName: true,
        placeAddress: true,
        placeDesc: true,
        placeGeojson: true,
      },
      where: {
        uuid,
      },
    });
  }

  async findAllUser() {
    const userList = await this.prisma.user.findMany({
      select: {
        uuid: true,
        fullname: true,
        createdAt: true,
        _count: true,
      },
    });

    if (userList.length === 0)
      throw new NotFoundException('Data pengguna tidak ditemukan');

    return userList;
  }

  async findOneUser(id: string) {
    return await this.prisma.user.findUnique({
      select: {
        fullname: true,
        username: true,
        description: true,
        place: {
          select: {
            uuid: true,
            placeName: true,
            placeAddress: true,
          },
        },
      },
      where: {
        uuid: id,
      },
    });
  }
}
