import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateKeywordDTO {
  @IsNotEmpty()
  @IsArray()
  keywords: string[];
}
