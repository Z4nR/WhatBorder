import { IsString, IsEmail } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
