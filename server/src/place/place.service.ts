import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PrismaService } from 'src/db/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PlaceService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async checkingPlace(placeGeojson: any) {
    return await this.prisma.geoData.findFirst({
      where: {
        placeGeojson,
      },
    });
  }

  async create(id: string, dto: CreatePlaceDto) {
    const idUser = await this.userService.findUser(id);
    if (!idUser) throw new NotFoundException('Id Pengguna tidak ditemukan');

    // const place = await this.checkingPlace(dto.placeGeojson);
    // if (place)
    //   throw new ConflictException('Lokasi sudah ditambahkan oleh orang lain');

    await this.prisma.geoData.create({
      data: {
        ...dto,
        userId: id,
      },
    });
    return { msg: 'Data tempat berhasil berhasil ditambahkan' };
  }

  findAll() {
    return `This action returns all place`;
  }

  findOne(id: number) {
    return `This action returns a #${id} place`;
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  remove(id: number) {
    return `This action removes a #${id} place`;
  }
}
