"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCatalogTables1722932430554 = void 0;
class CreateCatalogTables1722932430554 {
    constructor() {
        this.name = 'CreateCatalogTables1722932430554';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "catalog" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "productTracker" character varying NOT NULL, "category" character varying NOT NULL, "brandName" character varying NOT NULL, "modelNumber" character varying, "shortDescription" text NOT NULL, "longDescription" text NOT NULL, "images" text array NOT NULL, "price" numeric NOT NULL, "discountPrice" numeric, "availabilityStatus" boolean NOT NULL DEFAULT true, "shippingCost" numeric NOT NULL, "warrantyInformation" text NOT NULL, "returnPolicy" text, CONSTRAINT "UQ_c4027fae81ee94b5e9b73b27c45" UNIQUE ("productTracker"), CONSTRAINT "PK_782754bded12b4e75ad4afff913" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "catalog"`);
    }
}
exports.CreateCatalogTables1722932430554 = CreateCatalogTables1722932430554;
//# sourceMappingURL=1722932430554-CreateCatalogTables.js.map