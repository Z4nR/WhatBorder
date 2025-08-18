import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-authz.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AuthzService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(createAuthorizeDto: CreateRoleDto) {
    try {
      await this.prisma.role.create({
        data: {
          role_name: createAuthorizeDto.role_name,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findUserRole(userId: string) {
    try {
      const data = await this.prisma.user.findUnique({
        where: {
          user_id: userId,
          role: {
            active_status: true,
          },
        },
        select: {
          role: {
            select: {
              role_name: true,
            },
          },
        },
      });

      return { role_name: data.role.role_name };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
