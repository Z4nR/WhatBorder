import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthRegistDto {
  @IsString()
  @MinLength(4, { message: 'Nama pengguna harus lebih dari 4 karakter' })
  @MaxLength(8, { message: 'Nama pengguna tidak boleh lebih dari 8 karakter' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, {
    message:
      'Nama pengguna harus mengandung huruf kapital, huruf kecil, dan angka',
  })
  @IsNotEmpty({ message: 'Nama pengguna tidak boleh kosong' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama asli tidak boleh kosong' })
  fullname: string;

  @IsString()
  @MinLength(8, { message: 'Kata sandi harus lebih dari 8 karakter' })
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Verifikasi kata sandi tidak boleh kosong' })
  verify: string;

  @IsString()
  @Length(6, 6)
  @IsNotEmpty({ message: 'Kode spesial tidak boleh kosong' })
  code: string;
}

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama pengguna tidak boleh kosong' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Kata sandi tidak boleh kosong' })
  password: string;
}

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
