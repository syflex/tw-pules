import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MyCacheService {
  constructor(@Inject('MY_CACHE') private readonly myCache) {}

  getKeywordsInCache() {
    return this.myCache.keys();
  }

  checkKeywordInCache(keyword) {
    return this.myCache.has(keyword);
  }

  addKeywordToCache(keyword) {
    this.myCache.set(keyword, keyword);
    return this.getKeywordsInCache();
  }

  addMultipleKeywordsToCache(keywords) {
    this.myCache.mset(keywords);
    return this.getKeywordsInCache();
  }

  removeKeywordFromCache(keyword) {
    this.myCache.del(keyword);
    return this.getKeywordsInCache();
  }

  removeMultipleKeywordsFromCache(keywords) {
    this.myCache.mdel(keywords);
    return this.getKeywordsInCache();
  }
}
