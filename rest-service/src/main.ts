import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  const envType = configService.get<string>('app.environment');
  const apiName = configService.get<string>('app.apiName');
  const port = configService.get<number>('app.port');

  await app.listen(port, () => {
    logger.log(
      `******* Started the ${apiName} on port ${port} for ${envType} *******`,
    );
  });
}

bootstrap();
