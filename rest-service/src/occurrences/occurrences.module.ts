import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OccurrencesController } from './occurrences.controller';
import { OccurrencesRepository } from './occurrences.repository';
import { OccurrencesService } from './occurrences.service';

@Module({
  imports: [TypeOrmModule.forFeature([OccurrencesRepository])],
  controllers: [OccurrencesController],
  providers: [OccurrencesService],
})
export class OccurrencesModule { }
