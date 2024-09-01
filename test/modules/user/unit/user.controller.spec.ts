import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { UserController } from '../../../../src/modules/user/user.controller';
import { UserService } from '../../../../src/modules/user/user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
