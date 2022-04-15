import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { OccurrencesFilterDTO } from './occurrences.dto';
import { Occurrences } from './occurrences.entity';
import { OccurrencesService } from './occurrences.service';

@Controller('occurrences')
export class OccurrencesController {
  constructor(private readonly occurrencesService: OccurrencesService) {}
}
