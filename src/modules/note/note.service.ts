import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { SearchNoteDto } from './dto/search-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createNoteDto: CreateNoteDto) {
    return await this.prisma.note.create({
      data: createNoteDto,
    });
  }

  async search({ page, pageSize, userId }: SearchNoteDto) {
    return await this.prisma.note.findMany({
      where: {
        userId: userId,
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  async findOne(id: number) {
    return this.prisma.note.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, { content, targetDate, title }: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });
    if (!note) throw new NotFoundException(`Note with ${id} no found.`);

    return await this.prisma.note.update({
      where: {
        id,
      },
      data: {
        content,
        targetDate,
        title,
      },
    });
  }

  async remove(id: number) {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });
    if (!note) throw new NotFoundException(`Note with ${id} no found.`);
    return this.prisma.note.delete({
      where: { id },
    });
  }
}
