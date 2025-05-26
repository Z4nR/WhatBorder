import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthzDto } from './create-authz.dto';

export class UpdateAuthzDto extends PartialType(CreateAuthzDto) {}
