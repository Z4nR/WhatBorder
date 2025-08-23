import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMenuPathDto {
  @IsNotEmpty()
  @IsString()
  routeName: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsString()
  pathKey: string;

  @IsNotEmpty()
  @IsNumber()
  orderPath: number;

  @IsOptional()
  @IsString()
  parentId?: string;
}

export class CreateRoleAccessMenuDto {
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @IsNotEmpty()
  @IsString()
  routeId: string;
}
