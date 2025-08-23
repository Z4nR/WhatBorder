import { Injectable } from '@nestjs/common';
import {
  CreateMenuPathDto,
  CreateRoleAccessMenuDto,
} from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createMenuPath(data: CreateMenuPathDto) {
    try {
      const res = await this.prisma.route.create({
        data: {
          route_name: data.routeName,
          path: data.path,
          path_key: data.pathKey,
          order_path: data.orderPath,
          parent_id: data.parentId,
        },
      });

      return {
        message: 'Menu berhasil ditambahkan',
        route_id: res.route_id,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createRoleAccessMenu(data: CreateRoleAccessMenuDto) {
    try {
      await this.prisma.roleRoute.create({
        data: {
          role_id: data.roleId,
          route_id: data.routeId,
        },
      });

      return { message: 'Menu berhasil ditambahkan ke role baru' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all superAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} superAdmin`;
  }

  update(id: number, updateSuperAdminDto: UpdateSuperAdminDto) {
    return `This action updates a #${id} superAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} superAdmin`;
  }
}
