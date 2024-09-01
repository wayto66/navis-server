import { Module } from '@nestjs/common';
import { PrismaModule } from '../../infra/db/prisma/prisma.module';
import { CommentModule } from '../comment/comment.module';
import { CustomerModule } from '../customer/customer.module';
import { NoteModule } from '../note/note.module';
import { NotifyModule } from '../notify/notify.module';
import { ProjectModule } from '../project/project.module';
import { RoutineModule } from '../routine/routine.module';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UserModule,
    CustomerModule,
    TaskModule,
    PrismaModule,
    NotifyModule,
    CommentModule,
    ProjectModule,
    NoteModule,
    RoutineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
