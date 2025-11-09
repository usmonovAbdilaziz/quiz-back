import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateResaultDto } from './dto/update-resault.dto';
import { CreateResultDto } from './dto/create-resault.dto';
import { handleError, successMessage } from '../utils/global-response';
import { InjectModel } from '@nestjs/sequelize';
import { Result } from './entities/resault.entity';
import { UsersService } from '../users/users.service';
import { QuizService } from '../test/test.service';

@Injectable()
export class ResaultService {
  constructor(
    @InjectModel(Result) private readonly resultModel: typeof Result,
    private readonly userService: UsersService,
    private readonly quizService: QuizService,
  ) {}
  async create(createResaultDto: CreateResultDto) {
    try {
      const {studentId}=createResaultDto
      const student = await this.resultModel.findOne({ where: { studentId } });
      if (student){
        return successMessage(student,200)
      }
        const newResult = await this.resultModel.create({
          ...createResaultDto,
        });
      return successMessage(newResult, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const results = await this.resultModel.findAll();
      return successMessage(results);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.resultModel.findOne({ where: { id } });
      if (!result) {
        throw new NotFoundException('Result not found');
      }
      return successMessage(result);
    } catch (error) {
      handleError(error);
    }
  }
  async finAllTest(id:string){
     try {
       const result = await this.resultModel.findAll({ where: { testId:id } });
       if (!result) {
         throw new NotFoundException('Result not found');
       }
       return successMessage(result);
     } catch (error) {
       handleError(error);
     }
  }

  async update(id: string, updateResultDto: UpdateResaultDto) {
    try {
      const { testId, questions } = updateResultDto;
      const result = await this.resultModel.findByPk(id);
      if (!result) throw new NotFoundException('Result not found');

      const { data: quiz } = (await this.quizService.findOne(
        String(testId),
      )) as any;

      const oldQuestions = result.questions || [];

      const processedQuestions = questions!.map((studentQ) => {
        const quizQuestion = quiz.questions.filter(
          (q: any) => q.title === studentQ.title,
        );

        if (quizQuestion.length === 0) {
          throw new NotFoundException('Question not found');
        }
        if (!quizQuestion) return studentQ; // Savol topilmasa shunchaki qaytarish

        // Ichkarida aniqlanadigan qiymatlar
        const correctAnswerIndex = (quizQuestion[0].answerCount);
        const correctAnswer = quizQuestion[0].answers[correctAnswerIndex];    

        const count = studentQ.answer1 === correctAnswer ? 1 : 0;

        return {
          title: studentQ.title,
          answer1: studentQ.answer1,
          answer2: correctAnswer,
          count,
        };
      });
      // Eski questions bilan birlashtirish
      const updatedQuestions = [...oldQuestions, ...processedQuestions];

      await result.update({ questions: updatedQuestions });

      return successMessage(result);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.resultModel.destroy({ where: { id } });
      if (!result) {
        throw new NotFoundException('Result not found');
      }
      return successMessage({ message: 'Result deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
