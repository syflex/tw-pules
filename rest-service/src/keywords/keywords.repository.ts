import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AddKeywordToWatchlistResponse } from './add-keyword-to-watchlist-response';
import { AddKeywordToWatchlistDTO } from './add-keyword-to-watchlist.dto';
import { Keywords } from './keyword.entity';
import * as uuid from 'uuid';
import { KeywordStringResponses } from './keywords.string-responses';

@EntityRepository(Keywords)
@Injectable()
export class KeywordRepository extends Repository<Keywords> {
  protected KEY_WORD_DELETED_STATUS = 'deleted';

  async addKeywordToWatchlist({
    keywords,
  }: AddKeywordToWatchlistDTO): Promise<Array<AddKeywordToWatchlistResponse>> {
    const keywordPromises = [];
    const addedKeywords = [];

    for (let keyword of keywords) {
      if (/[^A-Za-z]+/.test(keyword)) {
        throw new BadRequestException({
          status: false,
          addedKeywords,
          errors: KeywordStringResponses.badInputResponse(keyword),
        });
      }

      keyword = keyword.toLowerCase();

      if (await this.findOne({ keyword })) {
        throw new BadRequestException({
          status: false,
          addedKeywords,
          errors: KeywordStringResponses.existingKeywordResponse(keyword),
        });
      }

      const newKeyword = new Keywords();

      newKeyword.id = uuid.v4();
      newKeyword.keyword = keyword.toLowerCase();
      newKeyword.created_at = new Date(Date.now());

      addedKeywords.push(newKeyword);

      keywordPromises.push(this.save(newKeyword));
    }

    await Promise.all(keywordPromises);

    return addedKeywords;
  }

  async deleteKeyWord(id: string) {
    const keyword = await this.findOne(id);

    if (!keyword) {
      throw new BadRequestException(`Keyword with id:${id} does not match a keyword.`);
    }

    keyword.status = this.KEY_WORD_DELETED_STATUS;
    await keyword.save();
    await this.softDelete(id);

    return keyword;
  }

  async validate_dates(from_time,to_time,){
    const from = new Date((from_time) * 1000);
    const to = new Date((to_time) * 1000);


    // check if date is valide date 
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return 'Invalid from_time or to_time';
    }

    // check if from_time is greater than or equal  to_time
    if (from.getTime() >= to.getTime()) {
      return 'from_time cannot be greater than to_time';
    }

    // check time diffrence
    var difference = to.getTime() - from.getTime();
    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24
    var hoursDifference = Math.floor(difference/1000/60/60);
    if (!difference || hoursDifference < 1 ) {
      return 'difference between from_time and to_time cannot be less than 1hour'
    }

    return 'success';
  }



async over_30_days_validation(keyword_last_occurrence_date){

  // check that last keyword occurrence date is not more than 30 days
  var priorDate = new Date().setDate(new Date().getDate()-30)
  const last_occurrences_date = new Date(Number(keyword_last_occurrence_date) * 1000);
  const prio = new Date(Number(priorDate));
  var difference =  last_occurrences_date.getTime() - prio.getTime();
  var daysDifference = Math.floor(difference/1000/60/60/24);

  if (daysDifference > 30) {
    return 'This keyword is not been tracked';
  }

  return 'success';
}
}
