import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMenuPathDto {
  @IsNotEmpty()
  @IsString()
  roleId: string;

  @IsNotEmpty()
  @IsString()
  routeName: string;

  @IsOptional()
  @IsString()
  pathRoute: string;

  @IsOptional()
  @IsString()
  pathSide: string;

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
