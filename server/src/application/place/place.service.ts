import { Injectable } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from 'src/db/prisma.service';
import { Place } from './entities/place.entity';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_id: string, name: string, createPlaceDto: CreatePlaceDto) {
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

        const buildingType = await tx.buildingType.findFirst({
          select: {
            building_id: true,
          },
          where: {
            name: createPlaceDto.placeType,
          },
        });

        await tx.placeData.create({
          data: {
            place_name: createPlaceDto.placeName,
            place_address: createPlaceDto.placeAddress,
            place_owner: createPlaceDto.placeOwner ?? null,
            place_description: createPlaceDto.placeDescription ?? null,
            place_center_point: createPlaceDto.placePoints,
            type_id: buildingType.building_id,
            map_id: placeMap.map_id,
            created_by: name,
            user_id,
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
          type: {
            select: {
              name: true,
              label: true,
            },
          },
          created_by: true,
          created_at: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findPlace(user_id: string) {
    try {
      return await this.prisma.placeData.findMany({
        select: {
          place_id: true,
          place_name: true,
          place_address: true,
          created_at: true,
        },
        where: {
          user_id,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(place_id: string) {
    try {
      return await this.prisma.placeData.findUnique({
        select: {
          place_name: true,
          place_owner: true,
          place_address: true,
          place_description: true,
          place_center_point: true,
          created_by: true,
          update_at: true,
          type: {
            select: {
              color: true,
              label: true,
              name: true,
            },
          },
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
          place_id,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async statistic(user_id: string) {
    try {
      const totalPlaceCount = await this.prisma.placeData.count();
      const buildingCount = await this.prisma.buildingType.findMany({
        select: {
          name: true,
          color: true,
          _count: {
            select: {
              PlaceData: {
                where: {
                  user_id,
                },
              },
            },
          },
        },
      });
      const newestPlace = await this.prisma.placeData.findMany({
        take: 10,
        orderBy: {
          created_at: 'desc',
        },
        select: {
          place_name: true,
          type: {
            select: {
              name: true,
              label: true,
            },
          },
          place_id: true,
          created_at: true,
        },
        where: {
          user_id,
        },
      });

      const building = buildingCount.map((item) => ({
        buildingName: item.name,
        color: item.color,
        placeCount: item._count.PlaceData,
      }));

      const newest = newestPlace.map((item) => ({
        placeId: item.place_id,
        placeName: item.place_name,
        placeType: item.type,
        createdAt: item.created_at,
      }));

      return {
        total_place: totalPlaceCount,
        detail: building,
        new_place: newest,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(
    place_id: string,
    user_id: string,
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
            place_id,
            user_id,
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
            place_id,
            user_id,
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

  async remove(place_id: string, user_id: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const mapId = await tx.placeData.findUnique({
          select: {
            map_id: true,
          },
          where: {
            place_id,
            user_id,
          },
        });

        await tx.placeMap.delete({
          where: {
            map_id: mapId.map_id,
          },
        });

        await tx.placeData.delete({
          where: {
            place_id,
            user_id,
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
