import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { AuthRegistDto } from 'src/auth/dto/auth-regist.dto';

export class UpdateUserDto extends PartialType(AuthRegistDto) {
  @IsString()
  @IsNotEmpty()
  description: string;
}
