import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PATCH, PUT,DELETE',
    allowedHeaders: 'Content-Type,Accept,Authorization',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
