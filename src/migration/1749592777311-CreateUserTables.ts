import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1749592777311 implements MigrationInterface {
    name = 'CreateUserTables1749592777311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "login_details" DROP CONSTRAINT "FK_f897d35a13a03253660b6dcf97f"`);
        await queryRunner.query(`ALTER TABLE "login_details" RENAME COLUMN "username" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "login_details" ADD CONSTRAINT "FK_8cf2686e09b4b9ca46f213bef29" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "login_details" DROP CONSTRAINT "FK_8cf2686e09b4b9ca46f213bef29"`);
        await queryRunner.query(`ALTER TABLE "login_details" RENAME COLUMN "userId" TO "username"`);
        await queryRunner.query(`ALTER TABLE "login_details" ADD CONSTRAINT "FK_f897d35a13a03253660b6dcf97f" FOREIGN KEY ("username") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
