import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-test.dto';
import { QuizService } from './test.service';
import { UpdateQuizDto } from './dto/update-test.dto';
import { AuthGuard } from 'guard/auth-guard';
import { RolesGuard } from 'guard/roles-guard';
@Controller('quizs')
@UseGuards(AuthGuard, RolesGuard)
export class QuizController {
  constructor(private readonly QuizService: QuizService) {}

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.QuizService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.QuizService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.QuizService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.QuizService.update(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.QuizService.remove(id);
  }
}
