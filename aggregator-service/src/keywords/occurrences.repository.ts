import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Occurrences } from './occurrences.entity';
import * as uuid from 'uuid';

@EntityRepository(Occurrences)
@Injectable()
export class OccurrencesRepository extends Repository<Occurrences> {
  logger = new Logger('OccurrencesRepository');

  async saveKeywordOccurrence(
    keywordId: string,
    count: number,
  ): Promise<Occurrences> {
    try {
      const newOccurrencesEntry = new Occurrences();

      newOccurrencesEntry.id = uuid.v4();
      newOccurrencesEntry.keyword_id = keywordId;
      newOccurrencesEntry.count = count;
      newOccurrencesEntry.epoch = new Date().getTime();
      newOccurrencesEntry.created_at = new Date(Date.now());
      await newOccurrencesEntry.save();

      return newOccurrencesEntry;
    } catch (err) {
      this.logger.error(`Internal server error ${err.stack}`);
      throw new InternalServerErrorException();
    }
  }
}
