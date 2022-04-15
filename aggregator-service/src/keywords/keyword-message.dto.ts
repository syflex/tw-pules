import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class KeywordMessageDto {
  @IsNotEmpty()
  @IsString()
  keyword: string;

  @IsNotEmpty()
  @IsNumber()
  epoch: string;
}
