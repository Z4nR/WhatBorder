import { IsEmail, IsString } from 'class-validator';

export class RegistUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
