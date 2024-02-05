import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(4, { message: 'Nama pengguna harus lebih dari 4 karakter' })
  @MaxLength(8, { message: 'Nama pengguna tidak boleh lebih dari 8 karakter' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message:
      'Nama pengguna harus mengandung huruf kapital, huruf kecil, dan angka',
  })
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama asli tidak boleh kosong' })
  fullname: string;

  @IsString()
  @IsOptional()
  description: string;
}
