import { Test, TestingModule } from '@nestjs/testing';
import { CajasController } from './cajas.controller.js';
import { CajasService } from './cajas.service.js';

describe('CajasController', () => {
  let controller: CajasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CajasController],
      providers: [CajasService],
    }).compile();

    controller = module.get<CajasController>(CajasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
