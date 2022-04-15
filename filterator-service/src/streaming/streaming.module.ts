import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { MyCacheModule } from '../MyCache/my-cache.module';
import { MyCacheService } from '../MyCache/my-cache.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KeywordFoundListener } from './listeners/keyword-found.listeners';
import { Publisher } from '../publisher/publisher';

@Module({
  imports: [
    HttpModule,
    MyCacheModule,
    EventEmitterModule.forRoot({
      // the delimiter used to segment namespaces
      delimiter: '.',
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
  ],
  controllers: [StreamingController],
  providers: [
    StreamingService,
    MyCacheService,
    KeywordFoundListener,
    Logger,
    ConfigService,
    Publisher,
  ],
})
export class StreamingModule {}
