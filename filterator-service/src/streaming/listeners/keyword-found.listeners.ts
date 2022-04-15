import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { KeywordFoundEvent } from '../events/keyword-found.event';
import { Publisher } from '../../publisher/publisher';

@Injectable()
export class KeywordFoundListener {
  constructor(private publisher: Publisher) {}

  @OnEvent('keyword.found')
  async handleKeywordFoundEvent(event: KeywordFoundEvent) {
    const message = { keyword: event.keyword, epoch: event.epoch };
    await this.publisher.Publish(message);
  }
}
