import { Test } from '@nestjs/testing';
import { Note } from '@prisma/client';
import { PrismaService } from 'src/infra/db/prisma/prisma.service';
import { CreateNoteDto } from 'src/modules/note/dto/create-note.dto';
import { SearchNoteDto } from 'src/modules/note/dto/search-note.dto';
import { UpdateNoteDto } from 'src/modules/note/dto/update-note.dto';
import { NoteService } from 'src/modules/note/note.service';

describe('NoteService', () => {
  let service: NoteService;
  let prisma: PrismaService;

  const dateNow = new Date();

  const sampleNote: Note = {
    id: 1,
    userId: 1,
    title: 'title',
    content: 'content',
    targetDate: dateNow,
    updatedAt: dateNow,
    createdAt: dateNow,
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [NoteService, PrismaService],
    }).compile();

    service = module.get(NoteService);
    prisma = module.get(PrismaService);
  });

  beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(prisma.note, 'create').mockResolvedValue(sampleNote);
    jest.spyOn(prisma.note, 'findUnique').mockResolvedValue(sampleNote);
    jest.spyOn(prisma.note, 'findMany').mockResolvedValue([sampleNote]);
    jest.spyOn(prisma.note, 'update').mockResolvedValue(sampleNote);
    jest.spyOn(prisma.note, 'delete').mockResolvedValue(sampleNote);
  });

  describe('create', () => {
    it('should create a note', async () => {
      const dto: CreateNoteDto = {
        content: 'content',
        title: 'title',
        userId: 1,
        targetDate: dateNow,
      };

      const result = await service.create(dto);
      expect(prisma.note.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sampleNote);
    });
  });

  describe('search', () => {
    it('should search for notes filtering by userId', async () => {
      const dto: SearchNoteDto = {
        userId: 1,
        page: 1,
        pageSize: 15,
      };

      const result = await service.search(dto);
      expect(prisma.note.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([sampleNote]);
    });
  });

  describe('findOne', () => {
    it('should find a note by id', async () => {
      const id = 1;
      const result = await service.findOne(id);
      expect(prisma.note.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sampleNote);
    });
  });

  describe('update', () => {
    it('should update a note', async () => {
      const noteId = 1;
      const dto: UpdateNoteDto = {
        content: 'new-content',
      };

      const updatedNote: Note = {
        ...sampleNote,
        content: 'new-content',
      };

      jest.spyOn(prisma.note, 'update').mockResolvedValueOnce(updatedNote);

      const result = await service.update(noteId, dto);
      expect(prisma.note.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.note.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedNote);
    });
  });

  describe('remove', () => {
    it('should remove a note', async () => {
      const id = 1;

      const result = await service.remove(id);
      expect(prisma.note.delete).toHaveBeenCalledTimes(1);
      expect(prisma.note.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(sampleNote);
    });
  });
});
