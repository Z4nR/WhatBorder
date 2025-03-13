import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { FeatureCollection } from './validator-geojson.dto';

export interface GeoJson {
  [key: string]: any;
}

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tempat tidak boleh kosong' })
  placeName: string;

  @IsString()
  @IsOptional()
  placeOwner?: string;

  @IsString()
  @IsOptional()
  placeDescription?: string;

  @IsString()
  @IsNotEmpty({ message: 'Alamat tempat tidak boleh kosong' })
  placeAddress: string;

  @IsString()
  @IsNotEmpty({ message: 'Jenis tempat tidak boleh kosong' })
  placeType: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  placePoints: number[];

  @IsObject({ message: 'Pastikan data yang dikirim berupa Javascript Object' })
  @IsNotEmpty({ message: 'Koordinat tempat tidak boleh kosong' })
  placeGeojson: FeatureCollection;
}
