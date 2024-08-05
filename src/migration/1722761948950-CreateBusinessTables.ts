import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBusinessTables1722761948950 implements MigrationInterface {
    name = 'CreateBusinessTables1722761948950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "business" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "businessName" character varying NOT NULL, "businessAddress" character varying NOT NULL, "registrationNumber" character varying NOT NULL, "storeName" character varying NOT NULL, "storeDescription" text NOT NULL, "storeLogo" character varying, "bankName" character varying NOT NULL, "bankAccountNumber" character varying NOT NULL, "bankAccountName" character varying NOT NULL, "swiftCode" character varying, "vendorAgreement" boolean NOT NULL DEFAULT true, "productCategories" text NOT NULL, "returnPolicy" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "business"`);
    }

}
