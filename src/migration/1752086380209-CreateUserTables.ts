import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1752086380209 implements MigrationInterface {
    name = 'CreateUserTables1752086380209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" ADD "code" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "code"`);
    }

}
