import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1752085946412 implements MigrationInterface {
    name = 'CreateUserTables1752085946412'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" ADD "isPaidToBusiness" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "payoutDate" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "payoutDate"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "isPaidToBusiness"`);
    }

}
