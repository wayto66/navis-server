import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoutineController],
  providers: [RoutineService],
})
export class RoutineModule {}
