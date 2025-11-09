import { Quiz, QuizingModule } from '@nestjs/Quizing';
import { QuizController } from './Quiz.controller';
import { QuizService } from './Quiz.service';

describe('QuizController', () => {
  let controller: QuizController;

  beforeEach(async () => {
    const module: QuizingModule = await Quiz.createQuizingModule({
      controllers: [QuizController],
      providers: [QuizService],
    }).compile();

    controller = module.get<QuizController>(QuizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
