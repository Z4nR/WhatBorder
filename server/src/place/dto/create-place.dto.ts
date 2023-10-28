import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama tempat tidak boleh kosong' })
  placeName: string;

  @IsJSON()
  @IsNotEmpty({ message: 'Koordinat tempat tidak boleh kosong' })
  placeGeojson: JSON;
}
