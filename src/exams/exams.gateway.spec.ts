import { Test, TestingModule } from '@nestjs/testing';
import { ExamsGateway } from './exams.gateway';
import { ExamsService } from './exams.service';

describe('ExamsGateway', () => {
  let gateway: ExamsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamsGateway, ExamsService],
    }).compile();

    gateway = module.get<ExamsGateway>(ExamsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
