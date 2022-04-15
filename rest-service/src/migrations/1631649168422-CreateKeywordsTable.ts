import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateKeywordsTable1631649168422 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "keyword_status" AS ENUM ('active', 'deleted');

      CREATE TABLE IF NOT EXISTS "keywords"(
        "id" VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
        "keyword" VARCHAR(50) UNIQUE NOT NULL,
        "status" keyword_status DEFAULT 'active',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "deleted_at" TIMESTAMPTZ NULL
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "keywords";
      DROP TYPE keyword_status;
    `);
  }
}
