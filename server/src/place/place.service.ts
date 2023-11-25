import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class PlaceService {
  constructor(private prisma: PrismaService) {}

  async findByIdPlace(uuid: string) {
    return await this.prisma.geoData.findUnique({
      where: {
        uuid,
      },
    });
  }

  async checkingPlace(geojson: any) {
    return await this.prisma.geoData.findFirst({
      where: {
        placeGeojson: {
          equals: geojson,
        },
      },
    });
  }

  async create(id: string, dto: CreatePlaceDto) {
    const place = await this.checkingPlace(dto.placeGeojson);
    if (place)
      throw new ConflictException('Lokasi sudah ditambahkan oleh orang lain');

    await this.prisma.geoData.create({
      data: {
        ...dto,
        userId: id,
      },
    });
    return { message: 'Data tempat berhasil berhasil ditambahkan' };
  }

  async update(userId: string, uuid: string, dto: UpdatePlaceDto) {
    await this.prisma.geoData.update({
      where: {
        uuid,
        userId,
      },
      data: {
        ...dto,
      },
    });
    return { message: 'Data tempat berhasil diperbarui' };
  }

  async remove(userId: string, uuid: string) {
    await this.prisma.geoData.delete({
      where: {
        uuid,
        userId,
      },
    });
    return { message: 'Data tempat berhasil dihapus' };
  }

  //All Place List
  async findAll() {
    const placeList = await this.prisma.geoData.findMany({
      select: {
        uuid: true,
        placeName: true,
        placeAddress: true,
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

  async findOne(uuid: string) {
    const data = await this.findByIdPlace(uuid);
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
}
