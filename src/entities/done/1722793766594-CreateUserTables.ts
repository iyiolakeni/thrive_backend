import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1722793766594 implements MigrationInterface {
    name = 'CreateUserTables1722793766594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "phoneNo" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "lastLogin" TIMESTAMP NOT NULL, "dob" TIMESTAMP NOT NULL, "registrationDate" TIMESTAMP NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
