import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useAdapters } from './adapters';
import { setConfig } from './app.config';
import { AppModule } from './app.module';
import { ConfigEnum } from './config/config.enum';
import { ConfigService } from './config/config.service';
import { useSwagger } from './swagger/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
    cors: {
      origin: process.env.ALLOWED_ORIGINS,
      credentials: true,
    },
  });

  setConfig(app);
  useAdapters(app);
  useSwagger(app);
  app.enableCors();
  const PORT = app.get(ConfigService).get(ConfigEnum.PORT);
  const HOST = app.get(ConfigService).get(ConfigEnum.HOST);
  await app.listen(process.env.PORT || PORT, process.env.HOST || HOST);
  console.log(`Server is listening on http://${HOST}:${PORT}`);
}
bootstrap();
