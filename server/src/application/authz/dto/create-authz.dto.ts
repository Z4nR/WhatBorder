import { IsString } from 'class-validator';

export class CreateAuthzDto {}

export class CreateRoleDto {
  @IsString()
  role_name: string;
}
