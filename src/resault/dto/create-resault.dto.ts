import {
  IsArray,
  ValidateNested,
  IsString,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ResultQuestionDto {
  @IsString()
  title: string;

  @IsString()
  answer1: string;//berilgan javob
}

export class CreateResultDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  studentId:string

  @IsString()
  @IsNotEmpty()
  testId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResultQuestionDto)
  questions: ResultQuestionDto[];
}
