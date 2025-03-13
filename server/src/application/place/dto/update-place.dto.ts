import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaceDto, GeoJson } from './create-place.dto';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { FeatureCollection } from './validator-geojson.dto';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {
  @IsString()
  @IsOptional()
  placeName?: string;

  @IsString()
  @IsOptional()
  placeAddress?: string;

  @IsString()
  @IsOptional()
  placeType?: string;

  @IsString()
  @IsOptional()
  placeOwner?: string;

  @IsString()
  @IsOptional()
  placeDescription?: string;

  @IsObject()
  @IsOptional()
  placeGeojson?: FeatureCollection;
}
