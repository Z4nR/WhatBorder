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

  async findById(uuid: string) {
    return await this.prisma.geoData.findUnique({
      where: {
        uuid,
      },
    });
  }

  async checkingPlace(placeGeojson: any) {
    return await this.prisma.geoData.findFirst({
      where: {
        placeGeojson,
      },
    });
  }

  async create(id: string, dto: CreatePlaceDto) {
    // const place = await this.checkingPlace(dto.placeGeojson);
    // if (place)
    //   throw new ConflictException('Lokasi sudah ditambahkan oleh orang lain');

    await this.prisma.geoData.create({
      data: {
        ...dto,
        userId: id,
      },
    });
    return { msg: 'Data tempat berhasil berhasil ditambahkan' };
  }

  findAll() {
    return `This action returns all place`;
  }

  async findOne(uuid: string) {
    const data = await this.findById(uuid);
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

  async update(uuid: string, dto: UpdatePlaceDto) {
    const updateTime = new Date().toISOString();

    await this.prisma.geoData.update({
      where: {
        uuid,
      },
      data: {
        ...dto,
        updateAt: updateTime,
      },
    });
    return { msg: 'Data tempat berhasil diperbarui' };
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
