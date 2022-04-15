import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { KeywordMessageDto } from './keyword-message.dto';
import { KeywordsService } from './keywords.service';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post('/message')
  @UsePipes(ValidationPipe)
  async addKeywordToWatchlist(@Body() keywordMessageDto: KeywordMessageDto) {
    const keywords = await this.keywordsService.addKeywordToBatch(
      keywordMessageDto,
    );

    return { success: true };
  }
}
