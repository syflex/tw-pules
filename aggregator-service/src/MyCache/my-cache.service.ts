import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MyCacheService {
  private readonly KEYWORD_COUNT_START = 0;

  constructor(@Inject('MY_CACHE') private readonly myCache) {}

  /**
   * Set the count of a keyword
   * @param keyword
   * @param count
   */
  private setKeywordCountInCache(keyword: string, count: number): void {
    this.myCache.set(keyword, count);
  }

  /**
   * Clear a keyword form cache. To be used after flushing the count of the keyword to the DB
   * @param keyword
   */
  clearKeywordInCache(keyword: string): void {
    this.myCache.del(keyword);
  }

  /**
   * Gets the current count of the keyword. Returns 0 if keyword is not in cache
   * @param keyword
   */
  getKeywordCountInCache(keyword: string): number {
    const count = this.myCache.get(keyword);

    if (count == undefined) return this.KEYWORD_COUNT_START;

    return Number(count);
  }

  /**
   * Retunrs all the keywords in the cache
   */
  getKeywordsInCache() {
    return this.myCache.keys();
  }

  /**
   * Increments the count of keyword in the cache by 1
   * @param keyword
   */
  incrementKeywordCountInCache(keyword: string): void {
    const count = this.getKeywordCountInCache(keyword);

    this.setKeywordCountInCache(keyword, count + 1);
  }
}
