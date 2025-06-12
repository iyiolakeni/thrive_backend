import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1749594432298 implements MigrationInterface {
    name = 'CreateUserTables1749594432298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "login_details" DROP COLUMN "deviceInfo"`);
        await queryRunner.query(`ALTER TABLE "login_details" ADD "deviceInfo" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "login_details" DROP COLUMN "deviceInfo"`);
        await queryRunner.query(`ALTER TABLE "login_details" ADD "deviceInfo" character varying(50) NOT NULL`);
    }

}
