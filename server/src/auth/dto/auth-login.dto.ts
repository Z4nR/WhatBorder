import { IsString, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama pengguna tidak boleh kosong' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  password: string;
}
