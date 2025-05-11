import { Injectable } from '@nestjs/common';
import { CreateAuthorizeDto } from './dto/create-authorize.dto';
import { UpdateAuthorizeDto } from './dto/update-authorize.dto';

@Injectable()
export class AuthorizeService {
  create(createAuthorizeDto: CreateAuthorizeDto) {
    return 'This action adds a new authorize';
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
