import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SearchCommentDto } from './dto/search-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCommentDto: CreateCommentDto) {
    return await this.prisma.comment.create({
      data: createCommentDto,
    });
  }

  async search(dto: SearchCommentDto) {
    return await this.prisma.comment.findMany({
      where: {
        taskId: dto.taskId,
        projectId: dto.projectId,
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });
  }
}
