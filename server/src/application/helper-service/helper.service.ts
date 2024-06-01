import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class HelperService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(username: string) {
    console.log(username);

    try {
      const data = await this.prisma.user.findFirst({
        where: {
          user_name: username,
        },
      });

      console.log(data);
      return data;
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

  async checkingPlaceName(name: string) {
    return await this.prisma.placeData.findFirst({
      where: {
        place_name: {
          equals: name,
        },
      },
    });
  }

  async checkingPlaceMap(geojson: any) {
    return await this.prisma.placeMap.findFirst({
      where: {
        place_geojson: {
          equals: geojson,
        },
      },
    });
  }
}
