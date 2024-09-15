import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAccount1726316183549 implements MigrationInterface {
  name = 'CreateTableAccount1726316183549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."account_account_type" AS ENUM('EMAIL', 'GOOGLE')
        `);
    await queryRunner.query(`
            CREATE TABLE "account" (
                "uuid" uuid NOT NULL,
                "email" character varying NOT NULL,
                "hashed_password" character varying,
                "account_type" "public"."account_account_type" NOT NULL,
                "deleted_at" TIMESTAMP,
                CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"),
                CONSTRAINT "account_type_password_constraint" CHECK (
                    "account_type" = 'EMAIL'
                    AND "hashed_password" IS NOT NULL
                ),
                CONSTRAINT "PK_31e2fd7720a2da3af586f17778f" PRIMARY KEY ("uuid")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "fullName"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "username"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "hashedPassword"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "email"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phoneNumber"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phoneCountryCode"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "uuid" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_a95e949168be7b7ece1a2382fed" PRIMARY KEY ("uuid")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "full_name" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phone_number" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phone_country_code" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "deleted_at" TIMESTAMP
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
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_c4209e2313f537dbe81320c7bc9" FOREIGN KEY ("accountUuid") REFERENCES "account"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_c4209e2313f537dbe81320c7bc9"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_c4209e2313f537dbe81320c7bc9"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "accountUuid"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "deleted_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phone_country_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "phone_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "full_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_a95e949168be7b7ece1a2382fed"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "uuid"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phoneCountryCode" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "phoneNumber" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "email" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "hashedPassword" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "username" character varying(30) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "fullName" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            DROP TABLE "account"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."account_account_type"
        `);
  }
}
