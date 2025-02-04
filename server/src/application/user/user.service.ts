import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { compare } from 'bcrypt';
import { HelperService } from '../helper-service/helper.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helperService: HelperService,
  ) {}

  async validateUserAccount(id: string) {
    try {
      const userExist = await this.helperService.findByIdUser(id);
      if (!userExist) throw new NotFoundException('Pengguna Tidak Ditemukan');

      return userExist;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findAll(id: string) {
    try {
      return await this.prisma.user.findMany({
        select: {
          user_id: true,
          user_name: true,
          description: true,
          created_at: true,
        },
        where: {
          admin: false,
          NOT: {
            user_id: id,
          },
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async profile(id: string) {
    try {
      const data = await this.prisma.user.findUnique({
        select: {
          full_name: true,
          user_name: true,
          admin: true,
          description: true,
          created_at: true,
          login_at: true,
          place: {
            select: {
              place_id: true,
              place_owner: true,
              place_description: true,
              place_name: true,
              place_address: true,
              place_center_point: true,
              created_at: true,
              updated_at: true,
              type: {
                select: {
                  name: true,
                  label: true,
                  color: true,
                },
              },
              place_map: {
                select: {
                  place_geojson: true,
                },
              },
            },
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        where: {
          user_id: id,
        },
      });

      const inisialAvatar = data.user_name.split('');
      const avatar = inisialAvatar[0] + inisialAvatar[1];

      return { ...data, avatar: avatar, me: id };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.user.findUnique({
        select: {
          user_name: true,
          full_name: true,
          description: true,
          created_at: true,
          _count: {
            select: {
              place: true,
            },
          },
        },
        where: {
          user_id: id,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    console.log(dto.username);

    if (dto.username) {
      const username = await this.helperService.findByUsername(dto.username);
      if (username)
        throw new ConflictException('Nama Pengguna sudah digunakan');
    }

    try {
      await this.prisma.user.update({
        where: {
          user_id: id,
        },
        data: dto,
      });
      return { message: 'Data pengguna berhasil diperbarui' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(id: string, userpass: string, password: string) {
    const pw = await compare(password, userpass);
    if (!pw) {
      throw new UnauthorizedException(
        'Kata sandi yang anda masukan tidak sesuai',
      );
    }

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

        const mapId = findPlaceId[0];
        console.log(mapId);

        if (mapId.length !== 0) {
          for (const item of mapId) {
            await tx.placeMap.delete({
              where: {
                map_id: item,
              },
            });
          }

          await tx.placeData.deleteMany({
            where: {
              user_id: id,
            },
          });
        }

        await tx.user.delete({
          where: {
            user_id: id,
          },
        });
      });

      return { message: 'Seluruh data pengguna berhasil dihapus' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
