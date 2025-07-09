import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1752087973404 implements MigrationInterface {
    name = 'CreateUserTables1752087973404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "withdrawal_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "withdrawnBy" character varying NOT NULL, "withdrawnAt" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL DEFAULT 'pending', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2447cd2b5001ddf81a7351e12ec" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "withdrawal_history"`);
    }

}
