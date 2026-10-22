import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

const config = new DocumentBuilder()
    .setTitle('API de Aluguéis de Jogos de Tabuleiro - WeB')
    .setDescription('Sistema desenvolvido para organização de estoque, locações, transações e controle de acesso de jogos.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Usuários')
    .addTag('Jogos')
    .addTag('Categorias')
    .addTag('Avaliações')
    .addTag('Aluguéis')
    .addTag('Pagamentos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
