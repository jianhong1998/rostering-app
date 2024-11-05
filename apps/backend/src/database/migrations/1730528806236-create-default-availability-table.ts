import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultAvailabilityTable1730528806236
  implements MigrationInterface
{
  name = 'CreateDefaultAvailabilityTable1730528806236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "weekday_timeslot" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "weekday_number" integer NOT NULL,
                "timeslot_uuid" uuid NOT NULL,
                CONSTRAINT "weekday_timeslot_ak" UNIQUE ("weekday_number", "timeslot_uuid"),
                CONSTRAINT "weekday_timeslot_weekday_number_constraint" CHECK (
                    weekday_number BETWEEN 1 AND 7
                ),
                CONSTRAINT "PK_5407cb5d12d1f1019005beb5936" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "default_availability" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "user_uuid" uuid,
                CONSTRAINT "default_availability_ak" UNIQUE ("user_uuid"),
                CONSTRAINT "PK_d12e790fe75a6530b127a5d548b" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "default_availability_weekday_timeslot" (
                "defaultAvailabilityUuid" uuid NOT NULL,
                "weekdayTimeslotUuid" uuid NOT NULL,
                CONSTRAINT "PK_70b7a80cea49af0b983111c6dd9" PRIMARY KEY ("defaultAvailabilityUuid", "weekdayTimeslotUuid")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_66518cd1c3162f25da3fade1d6" ON "default_availability_weekday_timeslot" ("defaultAvailabilityUuid")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_f5e09146f32b71feecb98b7a8b" ON "default_availability_weekday_timeslot" ("weekdayTimeslotUuid")
        `);
    await queryRunner.query(`
            ALTER TABLE "weekday_timeslot"
            ADD CONSTRAINT "FK_c70f58b2194118e92d59745cd02" FOREIGN KEY ("timeslot_uuid") REFERENCES "timeslot"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "default_availability"
            ADD CONSTRAINT "FK_82fb28db3860d2e8147f9a0b972" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "default_availability_weekday_timeslot"
            ADD CONSTRAINT "FK_66518cd1c3162f25da3fade1d6c" FOREIGN KEY ("defaultAvailabilityUuid") REFERENCES "default_availability"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "default_availability_weekday_timeslot"
            ADD CONSTRAINT "FK_f5e09146f32b71feecb98b7a8b0" FOREIGN KEY ("weekdayTimeslotUuid") REFERENCES "weekday_timeslot"("uuid") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "default_availability_weekday_timeslot" DROP CONSTRAINT "FK_f5e09146f32b71feecb98b7a8b0"
        `);
    await queryRunner.query(`
            ALTER TABLE "default_availability_weekday_timeslot" DROP CONSTRAINT "FK_66518cd1c3162f25da3fade1d6c"
        `);
    await queryRunner.query(`
            ALTER TABLE "default_availability" DROP CONSTRAINT "FK_82fb28db3860d2e8147f9a0b972"
        `);
    await queryRunner.query(`
            ALTER TABLE "weekday_timeslot" DROP CONSTRAINT "FK_c70f58b2194118e92d59745cd02"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f5e09146f32b71feecb98b7a8b"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_66518cd1c3162f25da3fade1d6"
        `);
    await queryRunner.query(`
            DROP TABLE "default_availability_weekday_timeslot"
        `);
    await queryRunner.query(`
            DROP TABLE "default_availability"
        `);
    await queryRunner.query(`
            DROP TABLE "weekday_timeslot"
        `);
  }
}
