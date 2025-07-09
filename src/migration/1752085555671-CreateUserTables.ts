import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1752085555671 implements MigrationInterface {
    name = 'CreateUserTables1752085555671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" ADD "isPaid" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "isPaid"`);
    }

}
