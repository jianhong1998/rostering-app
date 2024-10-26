import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompany1729469263525 implements MigrationInterface {
  name = 'CreateCompany1729469263525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "company" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"),
                CONSTRAINT "PK_3fa0b2af99d910864a56bb10c9e" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "company_uuid" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_863bbc053b1ce6f8c742e650e05" FOREIGN KEY ("company_uuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_863bbc053b1ce6f8c742e650e05"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "company_uuid"
        `);
    await queryRunner.query(`
            DROP TABLE "company"
        `);
  }
}
