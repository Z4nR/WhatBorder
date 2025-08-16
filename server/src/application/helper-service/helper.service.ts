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
    console.log(password);

    const specialValue = this.configService.get('USER_CODE');
    console.log('user code:', specialValue);

    const fullString = password.indexOf(specialValue);
    console.log(fullString);

    if (fullString === -1) {
      throw new BadRequestException(
        `Server anda sedang tidak aman, kode unik anda telah diganti`,
      );
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

  rangeCount(lat1: number, lat2: number, long1: number, long2: number): number {
    const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
    const dLon = ((long2 - long1) * Math.PI) / 180.0;

    const radLat1 = (lat1 * Math.PI) / 180.0;
    const radLat2 = (lat2 * Math.PI) / 180.0;

    const a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) * Math.cos(radLat1) * Math.cos(radLat2);

    const rad = 6371;
    const c = 2 * Math.asin(Math.sqrt(a));
    const rangeInKilometers = rad * c;
    console.log(rangeInKilometers);

    const rangeInMeters = rangeInKilometers * 1000;

    return Math.round(rangeInMeters);
  }

  formatMonth = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
  };
}
