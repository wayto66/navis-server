import { MiddlewareConsumer, Module } from '@nestjs/common';

import { MetricMiddleware } from '../../infra/middlewares/metric.middleware';
import { MetricController } from './metric.controller';
import { MetricService } from './metric.service';

@Module({
  controllers: [MetricController],
  providers: [MetricService],
  exports: [MetricService],
})
export class MetricModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricMiddleware).forRoutes('*');
  }
}
