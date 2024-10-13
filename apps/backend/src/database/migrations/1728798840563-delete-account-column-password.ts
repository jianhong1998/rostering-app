import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteAccountColumnPassword1728798840563
  implements MigrationInterface
{
  name = 'DeleteAccountColumnPassword1728798840563';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "account" DROP COLUMN "hashed_password"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "account"
            ADD "hashed_password" character varying
        `);
  }
}
