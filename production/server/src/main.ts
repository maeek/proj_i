import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle(`Printer management API`)
    .setVersion('1.0');

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('docs', app, document);

  app.use((_req, res: Response, next) => {
    res.removeHeader('X-Powered-By');
    next();
  });

  await app.listen(8080);
}
bootstrap();
