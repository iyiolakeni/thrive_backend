"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBusinessTables1722761948950 = void 0;
class CreateBusinessTables1722761948950 {
    constructor() {
        this.name = 'CreateBusinessTables1722761948950';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "business" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "businessName" character varying NOT NULL, "businessAddress" character varying NOT NULL, "registrationNumber" character varying NOT NULL, "storeName" character varying NOT NULL, "storeDescription" text NOT NULL, "storeLogo" character varying, "bankName" character varying NOT NULL, "bankAccountNumber" character varying NOT NULL, "bankAccountName" character varying NOT NULL, "swiftCode" character varying, "vendorAgreement" boolean NOT NULL DEFAULT true, "productCategories" text NOT NULL, "returnPolicy" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "business"`);
    }
}
exports.CreateBusinessTables1722761948950 = CreateBusinessTables1722761948950;
//# sourceMappingURL=1722761948950-CreateBusinessTables.js.map