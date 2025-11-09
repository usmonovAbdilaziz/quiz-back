import { Module } from '@nestjs/common';
import { ExamsGateway } from './exams.gateway';
import { ResaultModule } from 'src/resault/resault.module';
import { QuizModule } from 'src/test/test.module';

@Module({
  imports:[ResaultModule,QuizModule],
  providers: [ExamsGateway],
})
export class ExamsModule {}
