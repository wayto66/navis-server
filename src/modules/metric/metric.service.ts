import { Injectable } from '@nestjs/common';
import { Gauge, register } from 'prom-client';

@Injectable()
export class MetricService {
  private gauge: Gauge;
  constructor() {
    this.gauge = new Gauge({
      name: 'api_status',
      help: 'Status da API: 1 para online, 0 para offline',
    });
  }
  async isOnline() {
    this.gauge.set(1); // Defina 1 quando a API estiver online
    //  res.set('Content-Type', register.contentType);
    return await register.metrics();
  }
}
