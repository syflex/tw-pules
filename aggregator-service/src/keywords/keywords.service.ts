import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { KeywordMessageDto } from './keyword-message.dto';
import { MyCacheService } from '../MyCache/my-cache.service';
import { KeywordRepository } from './keywords.repository';
import { OccurrencesRepository } from './occurrences.repository';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(KeywordRepository)
    @InjectRepository(OccurrencesRepository)
    private readonly keywordRepository: KeywordRepository,
    private readonly occurrencesRepository: OccurrencesRepository,
    private logger: Logger,
    private readonly myCacheService: MyCacheService,
  ) {}

  async addKeywordToBatch(message: KeywordMessageDto) {
    this.myCacheService.incrementKeywordCountInCache(message.keyword);

    this.logger.log(
      `Received the keyword: ${message.keyword} for epoch: ${message.epoch}`,
    );
  }

  @Cron('0 0 * * * *') // every hour at minute and second 0
  async flushKeywordOccurrencesToDBCron() {
    const cacheKeywords = this.myCacheService.getKeywordsInCache();

    cacheKeywords.map(async (keyword) => {
      const currentKeywordCount =
        this.myCacheService.getKeywordCountInCache(keyword);

      const keywordEntity = await this.keywordRepository.findKeywordEntity(
        keyword,
      );

      if (keywordEntity) {
        await this.occurrencesRepository.saveKeywordOccurrence(
          keywordEntity.id,
          currentKeywordCount,
        );
      }

      this.myCacheService.clearKeywordInCache(keyword);
    });

    this.logger.log(
      `Flushed keywords to the DB at epoch: ${new Date().getTime()}`,
    );
  }
}
