import { IsNotEmpty, IsString, Length, Matches} from 'class-validator';

export class KeywordOccurrencesFilterDTO {
  @IsNotEmpty()
  @IsString()
  @Length(2, 29)
  @Matches(/^[a-zA-Z]/)
  keyword: string;

  @IsNotEmpty()
  @Length(9, 13)
  from_time: number;

  @IsNotEmpty()
  @Length(9, 13)
  to_time: number;
}
