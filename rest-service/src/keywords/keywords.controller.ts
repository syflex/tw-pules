import {
  Body,
  Controller,
  Get,
  Delete,
  Post,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Param,
  Query,
} from '@nestjs/common';
import { AddKeywordToWatchlistDTO } from './add-keyword-to-watchlist.dto';
import { KeywordOccurrencesFilterDTO } from './keyword-occurrences.dto';

import { KeywordsService } from './keywords.service';
import { Occurrences } from 'src/occurrences/occurrences.entity';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post('/create')
  @UsePipes(ValidationPipe)
  async addKeywordToWatchlist(
    @Body() addKeywordToWatchlistDTO: AddKeywordToWatchlistDTO,
  ) {
    const keywords = await this.keywordsService.addKeywordToWatchlist(
      addKeywordToWatchlistDTO,
    );

    return { success: true, keywords };
  }

  @Get('/fetch')
  async retrieveKeywordsOnWatchlist() {
    const keywords = await this.keywordsService.retrieveKeywordsOnWatchlist();

    return { success: true, keywords };
  }

  @Delete('/delete/:id')
  @UsePipes(ValidationPipe)
  async deleteKeyword(@Param('id', ParseUUIDPipe) id:string) {
    const keywords = await this.keywordsService.deleteKeywordById(id);
    return { success: true, keywords };
  }

  @Get('/timeseries')
  @UsePipes(ValidationPipe)
  async getOccurrences(@Query() data: KeywordOccurrencesFilterDTO): Promise<Occurrences[]> {
    const occurrence = await this.keywordsService.getOccurrences(data);
    return occurrence;
  }

}
