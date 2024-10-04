import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTempAuthTokenTable1728010184534
  implements MigrationInterface
{
  name = 'CreateTempAuthTokenTable1728010184534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_c4209e2313f537dbe81320c7bc9"
        `);
    await queryRunner.query(`
            CREATE TABLE "auth_token" (
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "expire_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "deletedAt" TIMESTAMP,
                "userUuid" uuid NOT NULL,
                CONSTRAINT "PK_7a769bd4ed3a9b98523dbd31afb" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "account"
            ALTER COLUMN "uuid"
            SET DEFAULT uuid_generate_v4()
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "uuid"
            SET DEFAULT uuid_generate_v4()
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_c4209e2313f537dbe81320c7bc9" FOREIGN KEY ("accountUuid") REFERENCES "account"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "auth_token"
            ADD CONSTRAINT "FK_18aa5ad32a42bdddd0f0e82dd27" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "auth_token" DROP CONSTRAINT "FK_18aa5ad32a42bdddd0f0e82dd27"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_c4209e2313f537dbe81320c7bc9"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "uuid" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "account"
            ALTER COLUMN "uuid" DROP DEFAULT
        `);
    await queryRunner.query(`
            DROP TABLE "auth_token"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_c4209e2313f537dbe81320c7bc9" FOREIGN KEY ("accountUuid") REFERENCES "account"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
