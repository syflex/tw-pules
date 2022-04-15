import { EntityRepository, Repository } from 'typeorm';
import { Keywords } from './keywords.entity';

@EntityRepository(Keywords)
export class KeywordsRepository extends Repository<Keywords> {}
