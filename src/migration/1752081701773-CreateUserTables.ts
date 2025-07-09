import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1752081701773 implements MigrationInterface {
    name = 'CreateUserTables1752081701773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_detail" ADD "paymentStatusMessage" character varying NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_detail" DROP COLUMN "paymentStatusMessage"`);
    }

}
