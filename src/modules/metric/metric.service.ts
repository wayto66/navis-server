import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram, register } from 'prom-client';

@Injectable()
export class MetricService {
  private httpRequestDurationMicroseconds: Histogram;
  private httpRequestCounter: Counter;
  private memoryUsageGauge: Gauge;
  private cpuUsageGauge: Gauge;

  constructor() {
    console.log('helo');
    this.httpRequestDurationMicroseconds = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duração das requisições em segundos',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    });

    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total de requisições recebidas',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.memoryUsageGauge = new Gauge({
      name: 'nodejs_memory_usage_bytes',
      help: 'Uso de memória da API em bytes',
      labelNames: ['type'],
    });

    this.cpuUsageGauge = new Gauge({
      name: 'nodejs_cpu_usage_percentage',
      help: 'Uso de CPU da API em porcentagem',
    });

    register.registerMetric(this.httpRequestDurationMicroseconds);
    register.registerMetric(this.httpRequestCounter);
    register.registerMetric(this.memoryUsageGauge);
    register.registerMetric(this.cpuUsageGauge);

    setInterval(() => {
      this.collectResourceMetrics();
    }, 5000);
  }

  observeRequestDuration(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
  ) {
    this.httpRequestDurationMicroseconds
      .labels(method, route, String(statusCode))
      .observe(duration);
  }

  incrementRequestCount(method: string, route: string, statusCode: number) {
    this.httpRequestCounter.labels(method, route, String(statusCode)).inc();
  }

  private collectResourceMetrics() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    this.memoryUsageGauge.labels('heapUsed').set(memoryUsage.heapUsed);
    this.memoryUsageGauge.labels('heapTotal').set(memoryUsage.heapTotal);

    const userCPUPercentage = cpuUsage.user / 1e6 / 100;
    const systemCPUPercentage = cpuUsage.system / 1e6 / 100;

    this.cpuUsageGauge.set(userCPUPercentage + systemCPUPercentage);
  }

  async getMetrics() {
    return await register.metrics();
  }
}
