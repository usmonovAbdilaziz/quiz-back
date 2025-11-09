import { Quiz, QuizingModule } from '@nestjs/Quizing';
import { QuizService } from './Quiz.service';

describe('QuizService', () => {
  let service: QuizService;

  beforeEach(async () => {
    const module: QuizingModule = await Quiz.createQuizingModule({
      providers: [QuizService],
    }).compile();

    service = module.get<QuizService>(QuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
