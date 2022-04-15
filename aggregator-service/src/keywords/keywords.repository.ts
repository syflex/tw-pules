import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Keywords } from './keyword.entity';

@EntityRepository(Keywords)
@Injectable()
export class KeywordRepository extends Repository<Keywords> {
  protected KEYWORD_ACTIVE_STATUS = 'active';

  async findKeywordEntity(keyword: string): Promise<Keywords> {
    return await this.findOne({ keyword, status: this.KEYWORD_ACTIVE_STATUS });
  }
}
