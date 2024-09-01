import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined;
  if (
    fs.existsSync('/etc/letsencrypt/live/alabarda.link/privkey.pem') &&
    fs.existsSync('/etc/letsencrypt/live/alabarda.link/fullchain.pem')
  ) {
    httpsOptions = {
      key: fs.readFileSync('/etc/letsencrypt/live/alabarda.link/privkey.pem'),
      cert: fs.readFileSync(
        '/etc/letsencrypt/live/alabarda.link/fullchain.pem',
      ),
    };
  }

  console.log({ httpsOptions });

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Navis API')
    .setDescription(
      `Navis is a Project Management System that provide tools for managing projects, tasks and deadlines, while also providing notifications via Whatsapp connection.`,
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4020);
}
bootstrap();
