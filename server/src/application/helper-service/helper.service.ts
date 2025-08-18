import { BadRequestException, Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HelperService {
  constructor(private readonly configService: ConfigService) {}

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
