import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexToKeywordId1631650338384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX "idx_occurrence_keyword" ON "occurrences" ("keyword_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_occurrence_keyword"`);
  }
}
