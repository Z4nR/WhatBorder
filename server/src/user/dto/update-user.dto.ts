import { PartialType } from '@nestjs/mapped-types';
import { RegistUserDto } from './regist-user.dto';

export class UpdateUserDto extends PartialType(RegistUserDto) {}
