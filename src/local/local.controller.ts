import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocalService } from './local.service';
import { CreateLocalDto } from './dto/create-local.dto';
import { UpdateLocalDto } from './dto/update-local.dto';

@Controller('local')
export class LocalController {
  constructor(private readonly localService: LocalService) {}

  @Post()
  create(@Body() createLocalDto: CreateLocalDto) {
    return this.localService.create(createLocalDto);
  }

  @Get()
  findAll() {
    return this.localService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.localService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocalDto: UpdateLocalDto) {
    return this.localService.update(+id, updateLocalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.localService.remove(+id);
  }
}
