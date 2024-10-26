import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyTimeslotTableRemoveStartTimeEndTimeConstraint1729830490652
  implements MigrationInterface
{
  name = 'ModifyTimeslotTableRemoveStartTimeEndTimeConstraint1729830490652';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "timeslot" DROP CONSTRAINT "timeslot_start_time_end_time_constraint"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "timeslot"
            ADD CONSTRAINT "timeslot_start_time_end_time_constraint" CHECK (
                    (
                        ((start_hour * 60) + start_minute) < ((end_hour * 60) + end_minute)
                    )
                )
        `);
  }
}
