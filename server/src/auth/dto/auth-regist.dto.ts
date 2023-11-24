import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AuthRegistDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama pengguna tidak boleh kosong' })
  username: string;

  @Matches(/[A-Za-z` ]/)
  @IsNotEmpty({ message: 'Nama asli tidak boleh kosong' })
  fullname: string;

  @IsString()
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  verify: string;
}
