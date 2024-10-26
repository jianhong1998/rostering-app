import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTimeslotTable1729721695627 implements MigrationInterface {
  name = 'CreateTimeslotTable1729721695627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_c4209e2313f537dbe81320c7bc9"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_863bbc053b1ce6f8c742e650e05"
        `);
    await queryRunner.query(`
            CREATE TABLE "timeslot" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "start_hour" integer NOT NULL,
                "start_minute" integer NOT NULL,
                "end_hour" integer NOT NULL,
                "end_minute" integer NOT NULL,
                "deleted_at" TIMESTAMP,
                "company_uuid" uuid NOT NULL,
                CONSTRAINT "timeslot_start_time_end_time_constraint" CHECK (
                    start_hour * 60 + start_minute < end_hour * 60 + end_minute
                ),
                CONSTRAINT "timeslot_minute_constraint" CHECK (
                    start_minute >= 0
                    AND start_minute <= 59
                    AND end_minute >= 0
                    AND end_minute <= 59
                ),
                CONSTRAINT "timeslot_hour_constraint" CHECK (
                    start_hour >= 0
                    AND start_hour <= 23
                    AND end_hour >= 0
                    AND end_hour <= 23
                ),
                CONSTRAINT "PK_e638d79c09d6583cbd19487f3c2" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_c4209e2313f537dbe81320c7bc9"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "accountUuid"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "account_uuid" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_86922df84877163a10338c04b98" UNIQUE ("account_uuid")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "company_uuid"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "timeslot"
            ADD CONSTRAINT "FK_3fb51376e960e0cd9ee560b2bbe" FOREIGN KEY ("company_uuid") REFERENCES "company"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_86922df84877163a10338c04b98" FOREIGN KEY ("account_uuid") REFERENCES "account"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_863bbc053b1ce6f8c742e650e05" FOREIGN KEY ("company_uuid") REFERENCES "company"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_863bbc053b1ce6f8c742e650e05"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_86922df84877163a10338c04b98"
        `);
    await queryRunner.query(`
            ALTER TABLE "timeslot" DROP CONSTRAINT "FK_3fb51376e960e0cd9ee560b2bbe"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "company_uuid" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_86922df84877163a10338c04b98"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "account_uuid"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "accountUuid" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_c4209e2313f537dbe81320c7bc9" UNIQUE ("accountUuid")
        `);
    await queryRunner.query(`
            DROP TABLE "timeslot"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_863bbc053b1ce6f8c742e650e05" FOREIGN KEY ("company_uuid") REFERENCES "company"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_c4209e2313f537dbe81320c7bc9" FOREIGN KEY ("accountUuid") REFERENCES "account"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }
}
