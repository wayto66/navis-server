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
  async isOnline(@Res() res: Response) {
    // Call the service to get the metrics
    const metrics = await this.metricService.isOnline();
    res.set('Content-Type', register.contentType); // Set the content type here
    return res.send(metrics); // Send the metrics as the response
  }
}
