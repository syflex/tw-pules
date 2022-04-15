import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class OccurrencesFilterDTO {
  @IsNotEmpty()
  @IsOptional()
  from_time: number;

  @IsNotEmpty()
  @IsOptional()
  to_time: number;
}
