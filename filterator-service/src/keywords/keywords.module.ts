import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MyCacheModule } from '../MyCache/my-cache.module';
import { MyCacheService } from '../MyCache/my-cache.service';
import { KeywordsController } from './keywords.controller';
import { KeywordsRepository } from './keywords.repository';
import { KeywordsService } from './keywords.service';
import { ConsistentHash } from '../consistentHashing/consistentHash';
import { StreamingService } from '../streaming/streaming.service';

@Module({
  imports: [TypeOrmModule.forFeature([KeywordsRepository]), MyCacheModule],
  controllers: [KeywordsController],
  providers: [
    KeywordsService,
    MyCacheService,
    ConfigService,
    ConsistentHash,
    StreamingService,
  ],
  exports: [KeywordsService],
})
export class KeywordsModule {}
