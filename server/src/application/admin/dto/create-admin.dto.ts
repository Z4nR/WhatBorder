import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {}

export class AddBuildingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
