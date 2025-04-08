import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddBuildingDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/db/prisma.service';
import { PlaceService } from '../place/place.service';
import { HelperService } from '../helper-service/helper.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly placeService: PlaceService,
    private readonly helperService: HelperService,
  ) {}

  async validateUserAccount(id: string) {
    try {
      const userExist = await this.helperService.findByIdUser(id);
      if (!userExist) throw new NotFoundException('Pengguna Tidak Ditemukan');
      if (userExist.admin)
        throw new BadRequestException('Tidak Dapat Menghapus Sesama Admin');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async validateRulerAccount(id: string) {
    try {
      const userExist = await this.helperService.findByIdUser(id);
      if (!userExist) throw new NotFoundException('Pengguna Tidak Ditemukan');
      if (!userExist.ruler)
        throw new BadRequestException(
          'Tidak Dapat Mengubah Status Pengguna Kecuali Pemilik Laman',
        );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async validatePlaceData(id: string) {
    try {
      const placeExist = await this.placeService.findOne(id);
      if (!placeExist) throw new NotFoundException('Tempat Tidak Ditemukan');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

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

  async findUserOnly() {
    try {
      return await this.prisma.user.findMany({
        where: {
          ruler: false,
          admin: false,
        },
        select: {
          user_id: true,
          user_name: true,
          created_at: true,
          admin: true,
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
