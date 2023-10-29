import { IsNotEmpty, IsObject, IsString } from 'class-validator';

interface GeoJson {
  [key: string]: any;
}

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tempat tidak boleh kosong' })
  placeName: string;

  @IsObject({ message: 'Pastikan data yang dikirim berupa Javascript Object' })
  @IsNotEmpty({ message: 'Koordinat tempat tidak boleh kosong' })
  placeGeojson: GeoJson;
}
