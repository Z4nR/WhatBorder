import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async me(id: string) {
    try {
      const data = await this.prisma.user.findFirst({
        select: {
          user_name: true,
          admin: true,
        },
        where: {
          user_id: id,
        },
      });

      return { username: data.user_name, role: data.admin };
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
          created_at: true,
        },
        where: {
          admin: false,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async myProfile(id: string) {
    return await this.prisma.user.findUnique({
      select: {
        full_name: true,
        user_name: true,
        admin: true,
        description: true,
        created_at: true,
        update_at: true,
        place: {
          select: {
            place_id: true,
            place_name: true,
            place_address: true,
            created_at: true,
          },
        },
      },
      where: {
        user_id: id,
      },
    });
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
        console.log(findPlaceId);

        const flatPlaceId = findPlaceId[0][0];

        await tx.placeMap.delete({
          where: {
            map_id: flatPlaceId,
          },
        });

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

      return { message: 'Seluruh data pengguna berhasil dihapus' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
