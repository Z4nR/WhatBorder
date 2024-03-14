import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class PlaceService {
  constructor(private prisma: PrismaService) {}

  async create(id: string, name: string, createPlaceDto: CreatePlaceDto) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const placeMap = await tx.placeMap.create({
          data: {
            place_geojson: createPlaceDto.placeGeojson,
            created_by: name,
          },
          select: {
            map_id: true,
          },
        });

        await tx.placeData.create({
          data: {
            place_name: createPlaceDto.placeName,
            place_address: createPlaceDto.placeAddress,
            place_type: createPlaceDto.placeType,
            map_id: placeMap.map_id,
            created_by: name,
            user_id: id,
          },
        });
      });

      return { message: 'Data tempat berhasil berhasil ditambahkan' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.placeData.findMany({
        select: {
          place_id: true,
          place_name: true,
          place_address: true,
          place_type: true,
          created_by: true,
          created_at: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findPlace(userId: string) {
    try {
      return await this.prisma.placeData.findMany({
        select: {
          place_id: true,
          place_name: true,
          place_address: true,
          created_at: true,
        },
        where: {
          user_id: userId,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.placeData.findUnique({
        select: {
          place_name: true,
          place_owner: true,
          place_address: true,
          place_description: true,
          created_by: true,
          update_at: true,
          place_map: {
            select: {
              place_geojson: true,
            },
          },
          user: {
            select: {
              user_id: true,
            },
          },
        },
        where: {
          place_id: id,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  async remove(id: string, userId: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const mapId = await tx.placeData.findUnique({
          select: {
            map_id: true,
          },
          where: {
            place_id: id,
            user_id: userId,
          },
        });

        await tx.placeMap.delete({
          where: {
            map_id: mapId.map_id,
          },
        });

        await tx.placeData.delete({
          where: {
            place_id: id,
            user_id: userId,
          },
        });
      });
      return { message: 'Data tempat berhasil dihapus' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
