import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { NotifyModule } from '../notify/notify.module';
import { ProjectModule } from '../project/project.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [PrismaModule, NotifyModule, ProjectModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
