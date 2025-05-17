import { IsString } from 'class-validator';

export class CreateAuthorizeDto {
  @IsString()
  role_name: string;
}
