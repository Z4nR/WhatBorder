import { PartialType } from '@nestjs/mapped-types';
import { ProfileDto } from './profile-user.dto';

export class UpdateUserDto extends PartialType(ProfileDto) {}
