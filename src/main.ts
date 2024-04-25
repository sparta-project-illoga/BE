import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //swagger
  const config = new DocumentBuilder()
    .setTitle('Illoga-swagger')
    .setDescription('API description')
    .setVersion('1.0.0')
    .addCookieAuth('jwt', { type: 'http', in: 'cookie' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: `${process.env.BACK_TO_FRONT_API}`,
    credentials: true,
  });

  await app.listen(8000);
}
bootstrap();
