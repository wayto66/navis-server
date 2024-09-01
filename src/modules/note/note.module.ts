import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/db/prisma/prisma.module';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
  imports: [PrismaModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
