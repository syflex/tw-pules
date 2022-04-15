import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OccurrencesRepository } from './occurrences.repository';

@Injectable()
export class OccurrencesService {
  logger = new Logger('OccurrencesService');
  constructor(
    @InjectRepository(OccurrencesRepository)
    private readonly occurrencesRepository: OccurrencesRepository,
  ) {}
}
