import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository, MoreThanOrEqual, Between } from 'typeorm';
import { OccurrencesFilterDTO } from './occurrences.dto';
import { Occurrences } from './occurrences.entity';

@EntityRepository(Occurrences)
export class OccurrencesRepository extends Repository<Occurrences> {
  logger = new Logger('OccurrencesRepository');

  async getOccurrences(data: OccurrencesFilterDTO): Promise<Occurrences[]> {
    const { from_time, to_time } = data;
    try {
      return await this.find({where:{epoch: Between(from_time, to_time)}})
    } catch (err) {
      this.logger.error(`Internal server error ${err.stack}`);
      throw new InternalServerErrorException();
    }
  }

}
