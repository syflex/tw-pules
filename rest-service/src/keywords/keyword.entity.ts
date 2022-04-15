import { Occurrences } from '../occurrences/occurrences.entity';
import { BaseEntity, Column, DeleteDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Keywords extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  keyword: string;

  @Column()
  status: string;

  @Column()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToMany(() => Occurrences, (occurrences) => occurrences.keywords, {
    eager: false,
    onDelete: 'CASCADE',
  })
  occurrences: Occurrences[];
  
}
