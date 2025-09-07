import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateMenuPathDto,
  CreateRoleAccessMenuDto,
} from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  // Check Data
  private async findByIdUser(userId: string) {
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

  async validateAdminStatus(id: string) {
    try {
      const userExist = await this.findByIdUser(id);
      if (!userExist) throw new NotFoundException('Pengguna Tidak Ditemukan');
      if (userExist.role_code !== 1)
        throw new BadRequestException(
          'Tidak Dapat Mengubah Status Pengguna Kecuali Super Admin',
        );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createMenuPath(data: CreateMenuPathDto) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const route = await tx.route.create({
          data: {
            route_name: data.routeName,
            path_route: data.pathRoute,
            path_side: data.pathSide,
            path_key: data.pathKey,
            order_path: data.orderPath,
            parent_id: data.parentId,
          },
        });

        await tx.roleRoute.create({
          data: {
            role_id: data.roleId,
            route_id: route.route_id,
          },
        });
      });

      return {
        message: 'Menu berhasil ditambahkan',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUserRole(id: string, body: { admin: boolean }) {
    try {
      const userExist = await this.findByIdUser(id);
      if (!userExist) throw new NotFoundException('Pengguna Tidak Ditemukan');

      const isAdmin = body.admin ? 2 : 3;
      if (userExist.role_code === isAdmin) {
        const roleText = body.admin ? 'Admin' : 'Pengguna';
        throw new BadRequestException(
          `Pengguna Sudah Memiliki Status Sebagai ${roleText}`,
        );
      }

      if (body.admin) {
        await this.prisma.user.update({
          where: {
            user_id: id,
          },
          data: {
            role_code: isAdmin,
          },
        });

        return {
          message: 'Berhasil Mengubah Status Pengguna Menjadi Admin',
        };
      } else {
        await this.prisma.user.update({
          where: {
            user_id: id,
          },
          data: {
            role_code: isAdmin,
          },
        });

        return { message: 'Berhasil Mengubah Status Menjadi Pengguna' };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
