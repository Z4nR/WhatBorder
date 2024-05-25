import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from 'src/db/prisma.service';
import { Place } from './entities/place.entity';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

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

        console.log(placeMap);

        await tx.placeData.create({
          data: {
            place_name: createPlaceDto.placeName,
            place_address: createPlaceDto.placeAddress,
            place_type: createPlaceDto.placeType,
            place_owner: createPlaceDto.placeOwner ?? null,
            place_description: createPlaceDto.placeDescription ?? null,
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

  async update(
    id: string,
    userId: string,
    userName: string,
    updatePlaceDto: UpdatePlaceDto,
  ) {
    const updatePlaceData: Place = {
      place_name: updatePlaceDto.placeName,
      place_address: updatePlaceDto.placeAddress,
      place_description: updatePlaceDto.placeDescription,
      place_owner: updatePlaceDto.placeOwner,
      place_type: updatePlaceDto.placeType,
      updated_by: userName,
    };

    try {
      await this.prisma.$transaction(async (tx) => {
        const mapId = await this.prisma.placeData.findFirst({
          select: {
            map_id: true,
          },
          where: {
            place_id: id,
            user_id: userId,
          },
        });

        if (!mapId) {
          throw new Error(
            'Place not found or you do not have permission to update it',
          );
        }

        await tx.placeData.update({
          data: updatePlaceData,
          where: {
            place_id: id,
            user_id: userId,
          },
        });

        if (updatePlaceDto.placeGeojson !== undefined) {
          await tx.placeMap.update({
            data: {
              place_geojson: updatePlaceDto.placeGeojson,
              updated_by: userName,
            },
            where: {
              map_id: mapId.map_id,
            },
          });
        }
      });
      return { message: 'Data Berhasil Diperbarui' };
    } catch (error) {
      console.log(error);
      throw error;
    }
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
