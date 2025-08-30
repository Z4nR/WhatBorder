import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddBuildingDto } from './dto/create-admin.dto';
import { PrismaService } from 'src/db/prisma.service';
import { PlaceService } from '../place/place.service';
import { UpdateBuildingDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly placeService: PlaceService,
  ) {}

  // Check Data
  private async findByIdUser(userId: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          user_id: userId,
          role: {
            active_status: true,
          },
        },
        select: {
          user_id: true,
          user_name: true,
          full_name: true,
          password: true,
          description: true,
          created_at: true,
          updated_at: true,
          special_code: true,
          login_at: true,
          role_code: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async validateUserAccount(id: string) {
    try {
      const userExist = await this.findByIdUser(id);
      if (!userExist) throw new NotFoundException('Pengguna Tidak Ditemukan');
      if (userExist.role_code === 2)
        throw new BadRequestException('Tidak Dapat Menghapus Sesama Admin');
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

  // Admin Service
  async findAll() {
    try {
      return await this.prisma.user.findMany({
        select: {
          user_id: true,
          user_name: true,
          description: true,
          created_at: true,
          role: {
            select: {
              role_name: true,
              label: true,
            },
          },
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
          role_code: 3,
        },
        select: {
          user_id: true,
          user_name: true,
          created_at: true,
          role: {
            select: {
              role_name: true,
              label: true,
            },
          },
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

  async createBuilding(building: AddBuildingDto, user: string) {
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

  async updateBuilding(id: number, building: UpdateBuildingDto, user: string) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const existing = await tx.buildingType.count({
          where: { building_id: id },
        });

        if (existing < 1) {
          throw new BadRequestException(
            'Data Jenis Bangunan Tidak Dapat Dihapus, Karena Sedang Digunakan Pada Data Tempat',
          );
        }

        await this.prisma.buildingType.update({
          where: { building_id: id },
          data: {
            ...building,
            updated_by: user,
          },
        });
      });

      return { message: 'Data Jenis Bangunan Berhasil Diperbarui' };
    } catch (error) {
      console.log(error);
    }
  }

  async removeBuilding(id: number) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const existing = await tx.placeData.count({
          where: { type_id: id },
        });

        if (existing >= 1) {
          throw new BadRequestException(
            'Data Jenis Bangunan Tidak Dapat Dihapus, Karena Sedang Digunakan Pada Data Tempat',
          );
        }

        if (existing < 1) {
          await tx.buildingType.delete({
            where: { building_id: id },
          });
        }
      });

      return { message: 'Data Jenis Bangunan Berhasil Dihapus' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
