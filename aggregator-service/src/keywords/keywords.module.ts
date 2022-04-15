import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeywordsService } from './keywords.service';
import { MyCacheModule } from '../MyCache/my-cache.module';
import { MyCacheService } from '../MyCache/my-cache.service';
import { KeywordsController } from './keywords.controller';
import { KeywordRepository } from './keywords.repository';
import { OccurrencesRepository } from './occurrences.repository';

@Module({
  imports: [
    MyCacheModule,
    TypeOrmModule.forFeature([KeywordRepository, OccurrencesRepository]),
  ],
  controllers: [KeywordsController],
  providers: [KeywordsService, Logger, MyCacheService],
})
export class KeywordsModule {}
