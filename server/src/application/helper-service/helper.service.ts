import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class HelperService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    console.log(username);

    try {
      const data = await this.prisma
        .$queryRaw`SELECT u.user_id, u.user_name, u.password, u.admin FROM User u WHERE BINARY u.user_name = ${username}`;

      console.log(data);
      return data[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findByIdUser(userId: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          user_id: userId,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async checkingPlace(geojson: any) {
    return await this.prisma.placeMap.findFirst({
      where: {
        place_geojson: {
          equals: geojson,
        },
      },
    });
  }
}
