import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1752081323209 implements MigrationInterface {
    name = 'CreateUserTables1752081323209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" ADD "businessId" uuid`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_f56f41818b8547dc1d31588b25f" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_f56f41818b8547dc1d31588b25f"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "businessId"`);
    }

}
