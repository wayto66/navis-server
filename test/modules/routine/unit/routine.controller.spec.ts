import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { RoutineController } from '../../../../src/modules/routine/routine.controller';
import { RoutineService } from '../../../../src/modules/routine/routine.service';

describe('RoutineController', () => {
  let controller: RoutineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [RoutineController],
      providers: [RoutineService],
    }).compile();

    controller = module.get<RoutineController>(RoutineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
