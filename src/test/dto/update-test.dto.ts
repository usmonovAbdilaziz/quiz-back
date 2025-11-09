import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizDto } from './create-test.dto';

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}
