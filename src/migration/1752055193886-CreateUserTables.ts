import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1752055193886 implements MigrationInterface {
    name = 'CreateUserTables1752055193886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" ALTER COLUMN "verifiedBy" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" ALTER COLUMN "verifiedBy" SET NOT NULL`);
    }

}
