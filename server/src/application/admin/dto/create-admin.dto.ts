import { IsNotEmpty, IsString } from 'class-validator';

export class AddBuildingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  label: string;
}
