import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama pengguna tidak boleh kosong' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  newpass: string;

  @IsString()
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  verify: string;
}
