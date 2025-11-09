import { Injectable, NotFoundException } from '@nestjs/common';
import { handleError, successMessage } from '../utils/global-response';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { Quiz } from './entities/test.entity';
import { CreateQuizDto } from './dto/create-test.dto';
import { UpdateQuizDto } from './dto/update-test.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz) private readonly QuizModel: typeof Quiz,
    private readonly userServise: UsersService,
  ) {}
  async create(createQuizDto: CreateQuizDto) {
    try {
      const { teacherId } = createQuizDto;

      // Using the updated findOne method that properly handles errors
      const {data} = (await this.userServise.findOne(teacherId)) as any;
      if (data.role!='teacher') {
        throw new NotFoundException('Teacher not found');
      }
      const newQuiz = await this.QuizModel.create({ ...createQuizDto });
      return successMessage(newQuiz, 201);
    } catch (error) {
      handleError(error);
    }
  }

  async findAll() {
    try {
      const Quizs = await this.QuizModel.findAll({ include: ['teacher'] });
      return successMessage(Quizs);
    } catch (error) {
      handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const Quiz = await this.QuizModel.findByPk(id, { include: ['teacher'] });
      if (!Quiz) {
        throw new NotFoundException('Quiz not found');
      }
      return successMessage(Quiz);
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    try {
      const quiz = await this.QuizModel.findByPk(id);
      if (!quiz) {
        throw new NotFoundException('Quiz not found');
      }
      const { data } = (await this.userServise.findOne(String(updateQuizDto.teacherId))) as any;
      if(data.role!= 'teacher'){
        throw new NotFoundException('Teacher not found');
      }
      // Agar questions mavjud bo'lsa, eski questions saqlab, yangi savollarni push qilamiz
      if (updateQuizDto .questions) {
        const oldQuestions = quiz.questions || [];
        const newQuestions = updateQuizDto.questions;
        updateQuizDto.questions = [...oldQuestions, ...newQuestions];
      }

      // Quiz ni update qilish
      await quiz.update({ ...updateQuizDto });

      return successMessage(quiz);
    } catch (error) {
      handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const Quiz = await this.QuizModel.findByPk(id);
      if (!Quiz) {
        throw new NotFoundException('Quiz not found');
      }

      await Quiz.destroy();
      return successMessage({ message: 'Quiz deleted successfully' });
    } catch (error) {
      handleError(error);
    }
  }
}
