import { PartialType } from '@nestjs/mapped-types';
import { AddBuildingDto } from './create-admin.dto';

export class UpdateBuildingDto extends PartialType(AddBuildingDto) {}
