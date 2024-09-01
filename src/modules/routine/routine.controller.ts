import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { SearchRoutineDto } from './dto/search-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutineService } from './routine.service';

@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post()
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routineService.create(createRoutineDto);
  }

  @Get()
  search(@Query() dto: SearchRoutineDto) {
    return this.routineService.search(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routineService.update(+id, updateRoutineDto);
  }

  @Patch('/check/:id')
  check(@Param('id') id: string) {
    return this.routineService.check(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routineService.remove(+id);
  }
}
