import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findPlaceData(uuid: string) {
    return await this.prisma.user.findMany({
      select: {
        place: {
          select: {
            placeName: true,
            placeGeojson: true,
            createdAt: true,
          },
        },
      },
      where: {
        uuid,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      select: {
        fullname: true,
        username: true,
        description: true,
        createdAt: true,
        updateAt: true,
        place: {
          select: {
            uuid: true,
            placeName: true,
            placeAddress: true,
            createdAt: true,
          },
        },
      },
      where: {
        uuid: id,
      },
    });
  }

  async update(uuid: string, dto: UpdateUserDto) {
    const updateTime = new Date().toISOString();

    await this.prisma.user.update({
      where: {
        uuid,
      },
      data: {
        ...dto,
        updateAt: updateTime,
      },
    });
    return { msg: 'Data pengguna berhasil diperbarui' };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
