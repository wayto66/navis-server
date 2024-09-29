import { MiddlewareConsumer, Module } from '@nestjs/common';

import { MetricMiddleware } from '../../infra/middlewares/metric.middleware';
import { MetricService } from './metric.service';

@Module({
  providers: [MetricService],
  exports: [MetricService],
})
export class MetricModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricMiddleware).forRoutes('*');
  }
}
