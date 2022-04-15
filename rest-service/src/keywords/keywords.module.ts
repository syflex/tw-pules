import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { KeywordsController } from './keywords.controller';
import { KeywordRepository } from './keywords.repository';
import { OccurrencesRepository } from '../occurrences/occurrences.repository';
import { KeywordsService } from './keywords.service';
import { KeywordStringResponses } from './keywords.string-responses';
import { KeywordAddedListener } from './listeners/keyword-added.listener';
import { KeywordDeletedListener } from './listeners/keyword-deleted.listener';
import { ConfigService } from '@nestjs/config';
import { ConsistentHash } from '../consistentHashing/consistentHash';

@Module({
  imports: [
    TypeOrmModule.forFeature([KeywordRepository, OccurrencesRepository]),
    HttpModule,
  ],
  controllers: [KeywordsController],
  providers: [
    KeywordsService,
    KeywordStringResponses,
    KeywordAddedListener,
    KeywordDeletedListener,
    Logger,
    ConfigService,
    ConsistentHash,
  ],
  exports: [KeywordStringResponses],
})
export class KeywordsModule {}
