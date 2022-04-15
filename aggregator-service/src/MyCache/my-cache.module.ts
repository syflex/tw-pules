import { Module } from '@nestjs/common';
import { MyCacheService } from './my-cache.service';
import * as NodeCache from 'node-cache';

const myCache = new NodeCache({
  stdTTL: 0,
  checkperiod: 0,
  deleteOnExpire: false,
});

@Module({
  providers: [
    MyCacheService,
    {
      provide: 'MY_CACHE',
      useValue: myCache,
    },
  ],
  exports: [MyCacheService, 'MY_CACHE'],
})
export class MyCacheModule {}
