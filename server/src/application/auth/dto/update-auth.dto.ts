import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama pengguna tidak boleh kosong' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  newpass: string;

  @IsString()
  @IsNotEmpty({ message: 'Verifikasi kata sandi tidak boleh kosong' })
  verify: string;

  @IsString()
  @Length(6, 6)
  @IsNotEmpty({ message: 'Kode spesial tidak boleh kosong' })
  code: string;
}
