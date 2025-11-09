import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsString,
  ArrayMinSize,
  IsOptional,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string; // Savol matni

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  answers: string[]; // Javob variantlari

  @IsOptional()
  @IsInt()
  answerCount?: number; // To'g'ri javoblar soni (optional)
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}