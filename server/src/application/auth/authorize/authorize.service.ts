import { Injectable } from '@nestjs/common';
import { CreateAuthorizeDto } from './dto/create-authorize.dto';
import { UpdateAuthorizeDto } from './dto/update-authorize.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AuthorizeService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(createAuthorizeDto: CreateAuthorizeDto) {
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

  findAll() {
    return `This action returns all authorize`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authorize`;
  }

  update(id: number, updateAuthorizeDto: UpdateAuthorizeDto) {
    return `This action updates a #${id} authorize`;
  }

  remove(id: number) {
    return `This action removes a #${id} authorize`;
  }
}
