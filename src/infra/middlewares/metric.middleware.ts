import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as onFinished from 'on-finished';
import { MetricService } from '../../modules/metric/metric.service';

@Injectable()
export class MetricMiddleware implements NestMiddleware {
  constructor(private readonly metricService: MetricService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();

    onFinished(res, () => {
      const [seconds, nanoseconds] = process.hrtime(start);
      const duration = seconds + nanoseconds / 1e9;

      this.metricService.observeRequestDuration(
        req.method,
        req.route?.path || req.url,
        res.statusCode,
        duration,
      );
    });

    this.metricService.incrementRequestCount(
      req.method,
      req.route?.path || req.url,
      res.statusCode,
    );

    next();
  }
}
