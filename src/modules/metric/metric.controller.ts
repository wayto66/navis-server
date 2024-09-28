import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetricService } from './metric.service';

@ApiTags('metrics')
@Controller('metric')
export class MetricController {
  constructor(private readonly metricService: MetricService) {}

  @Get()
  isOnline() {
    return this.metricService.isOnline();
  }
}
