import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { register } from 'prom-client';
import { MetricService } from './metric.service';

@ApiTags('metrics')
@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get()
  isOnline(@Res() res: Response) {
    res.set('Content-Type', register.contentType);
    return this.metricService.isOnline();
  }
}
