import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddKeywordToWatchlistDTO } from './add-keyword-to-watchlist.dto';
import { KeywordOccurrencesFilterDTO } from './keyword-occurrences.dto';
import { KeywordRepository } from './keywords.repository';
import { AddKeywordToWatchlistResponse } from './add-keyword-to-watchlist-response';
import { OccurrencesRepository } from '../occurrences/occurrences.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KeywordDeletedEvent } from './events/keyword-deleted.event';
import { KeywordAddedEvent } from './events/keyword-added-event';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(KeywordRepository)
    @InjectRepository(OccurrencesRepository)
    private readonly keywordRepository: KeywordRepository,
    private readonly occurrencesRepository: OccurrencesRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async addKeywordToWatchlist(
    addKeywordToWatchlistDTO: AddKeywordToWatchlistDTO,
  ): Promise<Array<AddKeywordToWatchlistResponse>> {
    const result = await this.keywordRepository.addKeywordToWatchlist(
      addKeywordToWatchlistDTO,
    );
    this.emitKeywordAddedEvent(addKeywordToWatchlistDTO.keywords);

    return result;
  }

  private emitKeywordAddedEvent(keywords: string[]) {
    keywords.map((keyword) => {
      const keywordAddedEvent = new KeywordAddedEvent();
      keywordAddedEvent.keyword = keyword;

      this.eventEmitter.emit('keyword.added', keywordAddedEvent);
    });
  }

  async retrieveKeywordsOnWatchlist(): Promise<
    Array<AddKeywordToWatchlistResponse>
  > {
    return await this.keywordRepository.find();
  }

  async deleteKeywordById(id: string) {
    const result = await this.keywordRepository.deleteKeyWord(id);
    this.emitKeywordDeletedEvent(result.keyword);

    return result;
  }

  private emitKeywordDeletedEvent(keyword: string) {
    const keywordDeletedEvent = new KeywordDeletedEvent();
    keywordDeletedEvent.keyword = keyword;

    this.eventEmitter.emit('keyword.deleted', keywordDeletedEvent);
  }

  async getOccurrences(data: KeywordOccurrencesFilterDTO): Promise<any> {
    const keywordObj = await this.keywordRepository.findOne({
      where: { keyword: data.keyword },
    });
    if (!keywordObj) {
      throw new HttpException(
        `Validation failed: ${data.keyword} does not match a keyword.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const validation_dates = await this.keywordRepository.validate_dates(
      data.from_time,
      data.to_time,
    );

    if (!(validation_dates === 'success')) {
      throw new HttpException(
        `Validation failed: ${validation_dates}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const keyword_last_occurrence_date =
      await this.occurrencesRepository.findOne({
        where: { keyword_id: keywordObj.id },
      });
    if (!keyword_last_occurrence_date) {
      throw new HttpException(
        `Validation failed: ${data.keyword} has no occurrence`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const over_30_days_validation =
      await this.keywordRepository.over_30_days_validation(
        keyword_last_occurrence_date.epoch,
      );
    if (!(over_30_days_validation === 'success')) {
      throw new HttpException(
        `Validation failed: This keyword ${data.keyword} is not being tracked`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.occurrencesRepository.getOccurrences(data);
  }
}
