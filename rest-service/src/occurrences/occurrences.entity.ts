import { Keywords } from '../keywords/keyword.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class Occurrences extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  keyword_id: string;

  @Column()
  count: number;

  @Column()
  epoch: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Keywords, (keywors) => keywors.occurrences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'keyword_id' })
  keywords: Keywords; 
}
