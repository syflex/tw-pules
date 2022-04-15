import { IsArray, IsNotEmpty } from 'class-validator';

export class AddKeywordToWatchlistDTO {
  @IsNotEmpty()
  @IsArray()
  keywords: string[];
}
