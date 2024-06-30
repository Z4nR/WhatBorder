import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HelperService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  decryptPassword(password: string) {
    const specialValue = this.configService.get('USER');
    const fullString = password.indexOf(specialValue);

    if (fullString === -1) {
      throw new BadRequestException(`Special value not found in '${password}'`);
    }

    const word = password.slice(fullString + specialValue.length);

    const bytes = CryptoJS.AES.decrypt(word, this.configService.get('SECRET'));
    console.log(bytes);
    const parsePassword = bytes.toString(CryptoJS.enc.Utf8);

    return parsePassword;
  }

  async findByUsername(username: string) {
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
