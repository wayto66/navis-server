import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { ServerResponse } from 'src/interfaces/ServerResponse';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<ServerResponse<User>> {
    const items = await this.prisma.user.findMany();
    return {
      items,
      message: 'Usuários encontrados.',
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async auth(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
        password,
      },
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async search(title: string) {
    return this.prisma.user.findMany({
      where: {
        name: {
          contains: title,
          mode: 'insensitive', // Caso queira que a busca seja case-insensitive
        },
      },
    });
  }
}
