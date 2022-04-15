import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { KeywordsService } from './keywords/keywords.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const logger = app.get<Logger>(Logger);

  const keywordsService = app.get<KeywordsService>(KeywordsService);

  const envType = configService.get<string>('app.environment');
  const apiName = configService.get<string>('app.apiName');
  const port = configService.get<number>('app.port');

  await app.listen(port, async () => {
    await keywordsService.addKeywordToCacheFromDatabase();

    logger.log(
      `******* Started the ${apiName} on port ${port} for ${envType} *******`,
    );
  });
}

bootstrap();
