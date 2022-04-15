import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { MyCacheService } from '../MyCache/my-cache.service';
import { IMultipleKeywords } from '../interfaces/multiple_keywords.interface';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly myCacheService: MyCacheService) {}

  @Post('add')
  async addKeywordsToCache(
    @Body('keywords', new ValidationPipe()) keywords: Array<string>,
  ) {
    const keywordObjects: Array<IMultipleKeywords> = keywords.map(
      (keyword) => ({ key: keyword, value: keyword }),
    );

    return this.myCacheService.addMultipleKeywordsToCache(keywordObjects);
  }

  @Get()
  async() {
    return this.myCacheService.getKeywordsInCache();
  }

  @Get()
  async checkKeywordInCache(
    @Param('keyword', new ValidationPipe()) keyword: string,
  ) {
    return this.myCacheService.checkKeywordInCache(keyword);
  }

  @Delete('/:keyword')
  async removeKeyWordsFromCache(
    @Param('keyword', new ValidationPipe()) keyword: string,
  ) {
    return this.myCacheService.removeKeywordFromCache(keyword);
  }
}
