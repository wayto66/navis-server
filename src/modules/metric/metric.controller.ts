import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricService } from './metric.service'; // Importar o serviço

@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get()
  async getMetrics(@Res() res: Response) {
    const metrics = await this.metricService.getMetrics();
    res.set('Content-Type', 'text/plain');
    res.send(metrics);
  }
}
