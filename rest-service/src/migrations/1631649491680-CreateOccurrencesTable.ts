import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOccurrencesTable1631649491680 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "occurrences"(
        "id" VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
        "keyword_id" VARCHAR(36) NOT NULL REFERENCES "keywords" ("id") ON DELETE CASCADE,
        "count" BIGINT NOT NULL,
        "epoch" BIGINT NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "occurrences"`);
  }
}
