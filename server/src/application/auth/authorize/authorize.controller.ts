import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { AuthorizeService } from './authorize.service';
import { CreateAuthorizeDto } from './dto/create-authorize.dto';
import { UpdateAuthorizeDto } from './dto/update-authorize.dto';
import { Public } from '../authentic/decorator/public.decorator';

@Public()
@Controller('authz')
export class AuthorizeController {
  constructor(private readonly authorizeService: AuthorizeService) {}

  @Version('1')
  @Post('role')
  create(@Body() createAuthorizeDto: CreateAuthorizeDto) {
    return this.authorizeService.createRole(createAuthorizeDto);
  }

  @Get()
  findAll() {
    return this.authorizeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorizeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthorizeDto: UpdateAuthorizeDto,
  ) {
    return this.authorizeService.update(+id, updateAuthorizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorizeService.remove(+id);
  }
}
