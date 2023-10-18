import { IsString, IsEmail } from 'class-validator';

export class AuthRegistDto {
  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
