import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async myProfile(id: string) {
    return await this.prisma.user.findUnique({
      select: {
        fullname: true,
        username: true,
        admin: true,
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

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findByIdUser(uuid: string) {
    return await this.prisma.user.findUnique({
      where: {
        uuid,
      },
    });
  }

  async showGeoJson(uuid: string) {
    return await this.prisma.user.findMany({
      select: {
        place: {
          select: {
            placeName: true,
            placeAddress: true,
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

  async update(uuid: string, dto: UpdateUserDto) {
    await this.prisma.user.update({
      where: {
        uuid,
      },
      data: {
        ...dto,
      },
    });
    return { message: 'Data pengguna berhasil diperbarui' };
  }

  async remove(uuid: string, password: string) {
    const user = await this.findByIdUser(uuid);

    const pw = await compare(password, user.password);
    if (!pw) {
      throw new UnauthorizedException(
        'Kata sandi yang anda masukan tidak sesuai',
      );
    }

    const deleteGeodata = this.prisma.geoData.deleteMany({
      where: {
        userId: uuid,
      },
    });

    const deleteUserdata = this.prisma.user.delete({
      where: {
        uuid,
      },
    });

    await this.prisma.$transaction([deleteGeodata, deleteUserdata]);

    return { message: 'Seluruh data pengguna berhasil dihapus' };
  }

  //Search User
  async findAll(name: string) {
    const userList = await this.prisma.user.findMany({
      select: {
        uuid: true,
        fullname: true,
        createdAt: true,
        _count: true,
      },
      where: {
        fullname: {
          search: name,
        },
      },
    });

    if (userList.length === 0)
      throw new NotFoundException('Data pengguna tidak ditemukan');

    return userList;
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      select: {
        fullname: true,
        username: true,
        description: true,
        place: {
          select: {
            uuid: true,
            placeName: true,
            placeAddress: true,
          },
        },
      },
      where: {
        uuid: id,
      },
    });
  }
}
