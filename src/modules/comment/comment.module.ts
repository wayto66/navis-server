import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
