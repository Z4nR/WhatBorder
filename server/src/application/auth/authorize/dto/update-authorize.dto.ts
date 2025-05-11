import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorizeDto } from './create-authorize.dto';

export class UpdateAuthorizeDto extends PartialType(CreateAuthorizeDto) {}
