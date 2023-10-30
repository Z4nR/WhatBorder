import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceDto } from './create-place.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {
  @IsString()
  @IsNotEmpty()
  placeAddress: string;

  @IsString()
  @IsNotEmpty()
  placeDesc: string;
}
