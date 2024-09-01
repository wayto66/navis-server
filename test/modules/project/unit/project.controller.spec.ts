import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { ProjectController } from 'src/modules/project/project.controller';
import { ProjectService } from 'src/modules/project/project.service';

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ProjectController],
      providers: [ProjectService],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
