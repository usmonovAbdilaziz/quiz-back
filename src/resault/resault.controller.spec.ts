import { Test, TestingModule } from '@nestjs/testing';
import { ResaultController } from './resault.controller';
import { ResaultService } from './resault.service';

describe('ResaultController', () => {
  let controller: ResaultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResaultController],
      providers: [ResaultService],
    }).compile();

    controller = module.get<ResaultController>(ResaultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
