import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ResaultService } from './resault.service';
import { UpdateResaultDto } from './dto/update-resault.dto';
import { CreateResultDto } from './dto/create-resault.dto';
import { AuthGuard } from 'guard/auth-guard';

@Controller('resault')
export class ResaultController {
  constructor(private readonly resaultService: ResaultService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createResaultDto: CreateResultDto) {
    return this.resaultService.create(createResaultDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.resaultService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resaultService.findOne(id);
  }
  @Get(':id/test')
  finAllTest(@Param('id') id: string) {
    return this.resaultService.finAllTest(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateResaultDto: UpdateResaultDto) {
    return this.resaultService.update(id, updateResaultDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.resaultService.remove(id);
  }
}
