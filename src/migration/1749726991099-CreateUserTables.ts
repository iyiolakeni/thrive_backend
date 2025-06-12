import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1749726991099 implements MigrationInterface {
    name = 'CreateUserTables1749726991099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "password_rest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "resetToken" character varying NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, CONSTRAINT "PK_bfa6690ac1d29cee7f10d13d82d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "password_rest" ADD CONSTRAINT "FK_b0f4afc0720d954536e8d6a3187" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_rest" DROP CONSTRAINT "FK_b0f4afc0720d954536e8d6a3187"`);
        await queryRunner.query(`DROP TABLE "password_rest"`);
    }

}
