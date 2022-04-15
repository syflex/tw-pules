import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Keywords extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  keyword: string;

  @Column()
  created_at: Date;
}
