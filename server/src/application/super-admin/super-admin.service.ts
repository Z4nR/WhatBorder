import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuPathDto } from './dto/create-super-admin.dto';
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

  async findUserRole() {
    try {
      return await this.prisma.user.findMany({
        where: {
          NOT: [{ role_code: 1 }],
        },
        select: {
          user_id: true,
          user_name: true,
          created_at: true,
          active_status: true,
          role: {
            select: {
              role_name: true,
              label: true,
            },
          },
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

  async getAllMenu() {
    try {
      const data = await this.prisma.route.findMany({
        where: { parent_id: null },
        select: {
          route_id: true,
          route_name: true,
          path_route: true,
          path_side: true,
          path_key: true,
          order_path: true,
          parent_id: true,
          children: {
            select: {
              route_id: true,
              route_name: true,
              path_route: true,
              path_side: true,
              path_key: true,
              order_path: true,
              parent_id: true,
            },
            orderBy: {
              order_path: 'asc',
            },
          },
        },
        orderBy: {
          path_route: 'asc',
        },
      });
      console.log(data);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getRoleRouteList(id: number | null) {
    try {
      const dataMenu = await this.getAllMenu();

      // Get ALL roles
      const dataRoles = await this.prisma.role.findMany({
        select: {
          role_code: true,
          role_name: true,
          RoleRoute: {
            select: {
              route_id: true,
            },
          },
        },
      });

      // route_id -> ALL roles that have access to the route
      const roleMap = new Map<
        string,
        { roleCode: number; roleName: string }[]
      >();

      for (const role of dataRoles) {
        for (const roleRoute of role.RoleRoute) {
          const roles = roleMap.get(roleRoute.route_id) ?? [];

          roles.push({
            roleCode: role.role_code,
            roleName: role.role_name,
          });

          roleMap.set(roleRoute.route_id, roles);
        }
      }

      // Only used for filtering when id !== null
      let selectedRouteIds: Set<string> | null = null;

      if (id !== null) {
        const selectedRole = dataRoles.find((role) => role.role_code === id);

        selectedRouteIds = new Set(
          selectedRole?.RoleRoute.map((roleRoute) => roleRoute.route_id) ?? [],
        );
      }

      const processRoutes = (routes: any[]): any[] => {
        return routes
          .map((route) => {
            const roles = roleMap.get(route.route_id) ?? [];

            const children = processRoutes(route.children ?? []);

            const hasAccess =
              selectedRouteIds === null || selectedRouteIds.has(route.route_id);

            if (!hasAccess && children.length === 0) {
              return null;
            }

            return {
              ...route,

              roleCode: id === null ? roles.map((role) => role.roleCode) : id,

              roleName:
                id === null
                  ? roles.map((role) => role.roleName)
                  : (roles.find((role) => role.roleCode === id)?.roleName ??
                    null),

              children,
            };
          })
          .filter((route): route is any => route !== null);
      };

      return processRoutes(dataMenu);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllRole() {
    try {
      const data = await this.prisma.role.findMany({
        where: {
          active_status: true,
        },
        select: {
          role_code: true,
          role_name: true,
        },
        orderBy: {
          role_code: 'asc',
        },
      });

      return data.map((item) => {
        return {
          value: item.role_code,
          label: item.role_name,
        };
      });
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

  async activeStatusUser(id: string) {
    try {
      const userExist = await this.prisma.user.findFirst({
        where: {
          user_id: id,
        },
        select: {
          user_id: true,
          active_status: true,
        },
      });

      if (!userExist) {
        throw new NotFoundException('Pengguna Tidak Ditemukan');
      }

      const status = userExist.active_status === true ? false : true;
      console.log(status);

      await this.prisma.user.update({
        where: {
          user_id: userExist.user_id,
        },
        data: {
          active_status: status,
        },
      });

      return { message: 'Akun pengguna berhasil dinonaktifkan oleh Admin' };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async removeUser(id: string) {
    try {
      const userExist = await this.prisma.user.findFirst({
        where: {
          user_id: id,
          role: {
            active_status: true,
            OR: [{ role_code: 2 }, { role_code: 3 }],
          },
        },
        select: {
          user_id: true,
        },
      });

      if (!userExist) {
        throw new NotFoundException('Pengguna Tidak Ditemukan');
      }

      await this.prisma.$transaction(async (tx) => {
        const findPlaceId = await tx.user.findMany({
          where: { user_id: id },
          select: {
            place: {
              select: { map_id: true },
            },
          },
        });

        const flatPlaceId = findPlaceId.flatMap((user) =>
          user.place.map((p) => p.map_id),
        );

        if (flatPlaceId.length > 0) {
          await tx.placeMap.deleteMany({
            where: { map_id: { in: flatPlaceId } },
          });
        }

        await tx.placeData.deleteMany({
          where: { user_id: id },
        });

        await tx.user.delete({
          where: { user_id: id },
        });
      });

      return {
        message: 'Seluruh data pengguna berhasil dihapus oleh Super Admin',
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
