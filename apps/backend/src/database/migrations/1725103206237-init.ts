import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1725103206237 implements MigrationInterface {
  name = 'Init1725103206237';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL,
                "fullName" character varying NOT NULL,
                "username" character varying(30) NOT NULL,
                "hashedPassword" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phoneNumber" integer NOT NULL,
                "phoneCountryCode" integer NOT NULL,
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
