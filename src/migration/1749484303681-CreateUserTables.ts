import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1749484303681 implements MigrationInterface {
	name = "CreateUserTables1749484303681";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."user_usertype_enum" AS ENUM('USER', 'VENDOR', 'ADMIN')`
		);
		await queryRunner.query(
			`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "phoneNo" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "dob" TIMESTAMP NOT NULL, "userType" "public"."user_usertype_enum" NOT NULL DEFAULT 'USER', "registrationDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "login_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" uuid NOT NULL, "loginTime" TIMESTAMP NOT NULL DEFAULT now(), "ipAddress" character varying(15) NOT NULL, "deviceInfo" character varying(50) NOT NULL, "userAgent" character varying, "loginSuccess" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_742096972b13439138aa2ca378d" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "login_details" ADD CONSTRAINT "FK_f897d35a13a03253660b6dcf97f" FOREIGN KEY ("username") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "login_details" DROP CONSTRAINT "FK_f897d35a13a03253660b6dcf97f"`
		);
		await queryRunner.query(`DROP TABLE "login_details"`);
		await queryRunner.query(`DROP TABLE "user"`);
		await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
	}
}
