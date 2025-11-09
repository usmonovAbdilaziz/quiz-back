import { Test, TestingModule } from '@nestjs/testing';
import { ResaultService } from './resault.service';

describe('ResaultService', () => {
  let service: ResaultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResaultService],
    }).compile();

    service = module.get<ResaultService>(ResaultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
