import { Injectable } from '@nestjs/common';
import { AddBuildingDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.user.findMany({
        select: {
          user_id: true,
          user_name: true,
          description: true,
          admin: true,
          created_at: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removePlace(id: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const mapId = await tx.placeData.findUnique({
          select: {
            map_id: true,
          },
          where: {
            place_id: id,
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
          },
        });
      });
      return { message: 'Data tempat berhasil dihapus oleh admin' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async removeUser(id: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const findPlaceId = await tx.user
          .findMany({
            select: {
              place: {
                select: {
                  map_id: true,
                },
              },
            },
            where: {
              user_id: id,
            },
          })
          .then((users) =>
            users.map((user) => user.place.map((place) => place.map_id)),
          );
        console.log(findPlaceId);

        const flatPlaceId = findPlaceId.flat();

        await Promise.all(
          flatPlaceId.map(async (placeid) => {
            await tx.placeMap.delete({
              where: {
                map_id: placeid,
              },
            });
          }),
        );

        await tx.placeData.deleteMany({
          where: {
            user_id: id,
          },
        });

        await tx.user.delete({
          where: {
            user_id: id,
          },
        });
      });

      return { message: 'Seluruh data pengguna berhasil dihapus oleh admin' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addBuilding(building: AddBuildingDto, user: string) {
    try {
      await this.prisma.buildingType.create({
        data: {
          ...building,
          created_by: user,
        },
      });

      return { message: 'Data Jenis Bangunan Berhasil Ditambahkan' };
    } catch (error) {
      console.log(error);
    }
  }
}
