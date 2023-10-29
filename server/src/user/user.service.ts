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

  async findUser(uuid: string) {
    return await this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });
  }

  async findPlaceData(uuid: string) {
    const idUser = await this.findUser(uuid);
    if (!idUser) throw new NotFoundException('Id Pengguna tidak ditemukan');

    return await this.prisma.user.findMany({
      select: {
        place: {
          select: {
            placeName: true,
            placeGeojson: true,
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

  findById(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
