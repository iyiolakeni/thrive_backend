import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1751979856954 implements MigrationInterface {
    name = 'CreateUserTables1751979856954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_category" ADD "createdBy" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD "createdBy" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "business" ADD "verifiedBy" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "verifiedBy"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "product_category" DROP COLUMN "createdBy"`);
    }

}
