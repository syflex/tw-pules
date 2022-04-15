import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MyCacheService } from '../MyCache/my-cache.service';
import { IMultipleKeywords } from 'src/interfaces/multiple_keywords.interface';
import { KeywordsRepository } from './keywords.repository';
import { ConsistentHash } from '../consistentHashing/consistentHash';
import { StreamingService } from '../streaming/streaming.service';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(KeywordsRepository)
    private readonly keywordsRepository: KeywordsRepository,
    private readonly myCacheService: MyCacheService,
    private configService: ConfigService,
    private consistentHash: ConsistentHash,
    private streamingService: StreamingService,
  ) {}

  async addKeywordToCacheFromDatabase() {
    let keywords = [];

    try {
      let keywordEntities = await this.keywordsRepository.find();

      const currentHost = this.configService.get<string>(
        'filteratorCluster.currentService',
      );
      const filteratorCluster = this.configService.get<string>(
        'filteratorCluster.services',
      );
      const filteratorClusterList = JSON.parse(filteratorCluster);

      filteratorClusterList.map((node) => {
        this.consistentHash.AddNode(node);
      });

      keywordEntities = keywordEntities.filter(({ keyword }) => {
        return this.consistentHash.Assign(keyword) === currentHost;
      });

      if (keywordEntities.length > 0) {
        const keywordObjects: Array<IMultipleKeywords> = keywordEntities.map(
          ({ keyword }) => ({ key: keyword, value: keyword }),
        );

        keywords = await this.myCacheService.addMultipleKeywordsToCache(
          keywordObjects,
        );
      }

      await this.streamingService.startStreaming();

      return keywords;
    } catch (error) {
      console.log(error);
    }
  }
}
