import { Injectable } from '@nestjs/common';
import { MyCacheService } from '../MyCache/my-cache.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KeywordFoundEvent } from './events/keyword-found.event';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const needle = require('needle');

@Injectable()
export class StreamingService {
  constructor(
    private readonly myCacheService: MyCacheService,
    private eventEmitter: EventEmitter2,
  ) {}

  startStreaming() {
    this.streamConnect(0);
  }

  streamConnect(retryAttempt) {
    const token = process.env.TOKEN;
    const streamURL = process.env.STREAM_URL;

    const stream = needle.get(streamURL, {
      headers: {
        'User-Agent': 'v2SampleStreamJS',
        Authorization: `Bearer ${token}`,
      },
      timeout: 20000,
    });

    stream
      .on('data', (data) => {
        try {
          const json = JSON.parse(data);

          this.tokenizeCompareKeywordToText(json.data.text);

          retryAttempt = 0;
        } catch (e) {
          // Catches error in case of 401 unauthorized error status.
          if (data.status === 401) {
            console.log(data.data);
            process.exit(1);
          } else if (
            data.detail ===
            'This stream is currently at the maximum allowed connection limit.'
          ) {
            console.log(data.detail);
            process.exit(1);
          } else {
            // Keep alive signal received. Do nothing.
          }
        }
      })
      .on('err', (error) => {
        if (error.code !== 'ECONNRESET') {
          console.log(error.code);
          process.exit(1);
        } else {
          // This reconnection logic will attempt to reconnect when a disconnection is detected.
          // To avoid rate limits, this logic implements exponential backoff, so the wait time
          // will increase if the client cannot reconnect to the stream.
          setTimeout(() => {
            console.warn('A connection error occurred. Reconnecting...');
            this.streamConnect(++retryAttempt);
          }, 2 ** retryAttempt);
        }
      });
    return stream;
  }

  /**
   * TODO: case for optimization here. Split and lowercase can be done in one iteration.
   * TODO: also using a map for the tokens will make comparison happen in constant time (in place of includes).
   * FIXME: iterate through the tweet once, lower-casing and splitting as you go, storing tokens in the hash map.
   */
  tokenizeCompareKeywordToText(tweet) {
    const keywords = this.myCacheService.getKeywordsInCache();
    const textArray = tweet.toLowerCase().split(/[\s,.#\-()]+/);

    keywords.forEach((keyword) => {
      if (textArray.includes(keyword.toLowerCase())) {
        this.emitKeywordEvent(keyword);
        console.log(tweet);
      }
    });
  }

  emitKeywordEvent(keyword) {
    const keywordFoundEvent = new KeywordFoundEvent();
    keywordFoundEvent.keyword = keyword;
    keywordFoundEvent.epoch = new Date().getTime();
    this.eventEmitter.emit('keyword.found', keywordFoundEvent);
  }
}
