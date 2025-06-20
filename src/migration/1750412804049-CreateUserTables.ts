import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1750412804049 implements MigrationInterface {
    name = 'CreateUserTables1750412804049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "login_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "loginTime" TIMESTAMP NOT NULL DEFAULT now(), "ipAddress" character varying(15) NOT NULL, "deviceInfo" character varying NOT NULL, "userAgent" character varying, "loginSuccess" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_742096972b13439138aa2ca378d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('USER', 'VENDOR', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "phoneNo" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "dob" TIMESTAMP NOT NULL, "userType" "public"."user_usertype_enum" NOT NULL DEFAULT 'USER', "registrationDate" TIMESTAMP NOT NULL DEFAULT now(), "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_638bac731294171648258260ff2" UNIQUE ("password"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."product_category_categorytype_enum" AS ENUM('PHYSICAL', 'DIGITAL', 'SERVICE')`);
        await queryRunner.query(`CREATE TABLE "product_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "categoryType" "public"."product_category_categorytype_enum" NOT NULL DEFAULT 'DIGITAL', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "totalPurchases" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_96152d453aaea425b5afde3ae9f" UNIQUE ("name"), CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "unitPrice" numeric(10,2) NOT NULL, "price" numeric(10,2) NOT NULL, "isAvailable" boolean NOT NULL DEFAULT true, "stock" integer NOT NULL DEFAULT '0', "discount" integer NOT NULL DEFAULT '0', "rating" integer DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "imageUrl" character varying, "categoryId" uuid NOT NULL DEFAULT 'a25c1f19-7a9d-44cd-b471-9a280438efa0', "businessId" uuid NOT NULL DEFAULT '2e0d28fb-c8c9-4790-bbd2-dfe36f3cd0f3', CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "business" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "businessName" character varying NOT NULL, "businessAddress" character varying NOT NULL, "registrationNumber" character varying NOT NULL, "storeLogo" character varying, "bankName" character varying NOT NULL, "bankAccountNumber" character varying NOT NULL, "bank_code" character varying NOT NULL, "vendorAgreement" boolean NOT NULL DEFAULT true, "returnPolicy" boolean NOT NULL DEFAULT true, "userId" uuid NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "registrationDate" TIMESTAMP NOT NULL DEFAULT now(), "verificationDate" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT false, "modificationDate" TIMESTAMP, CONSTRAINT "REL_ac8ad696f6731c86b52c058c0c" UNIQUE ("userId"), CONSTRAINT "PK_0bd850da8dafab992e2e9b058e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password_rest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "resetToken" character varying NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, CONSTRAINT "PK_bfa6690ac1d29cee7f10d13d82d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paymentReference" character varying NOT NULL, "paymentStatus" boolean NOT NULL, "paymentMethod" character varying NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e0947b770a56e455a6a22df5931" UNIQUE ("paymentReference"), CONSTRAINT "PK_bafdd7fde2ed67494cf9cd9ec2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "price" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "paymentReference" character varying NOT NULL, "productId" uuid, "transactionDetailId" uuid, "userId" uuid, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "login_details" ADD CONSTRAINT "FK_8cf2686e09b4b9ca46f213bef29" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_8b95800811275dd98a888044d50" FOREIGN KEY ("businessId") REFERENCES "business"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business" ADD CONSTRAINT "FK_ac8ad696f6731c86b52c058c0c6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_rest" ADD CONSTRAINT "FK_b0f4afc0720d954536e8d6a3187" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_9af3a556aa0f166dd771a1e6c46" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_5d0d447b12b9191f4d62ec12d73" FOREIGN KEY ("transactionDetailId") REFERENCES "transaction_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_5d0d447b12b9191f4d62ec12d73"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_9af3a556aa0f166dd771a1e6c46"`);
        await queryRunner.query(`ALTER TABLE "password_rest" DROP CONSTRAINT "FK_b0f4afc0720d954536e8d6a3187"`);
        await queryRunner.query(`ALTER TABLE "business" DROP CONSTRAINT "FK_ac8ad696f6731c86b52c058c0c6"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_8b95800811275dd98a888044d50"`);
        await queryRunner.query(`ALTER TABLE "login_details" DROP CONSTRAINT "FK_8cf2686e09b4b9ca46f213bef29"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
        await queryRunner.query(`DROP TABLE "transaction_detail"`);
        await queryRunner.query(`DROP TABLE "password_rest"`);
        await queryRunner.query(`DROP TABLE "business"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "product_category"`);
        await queryRunner.query(`DROP TYPE "public"."product_category_categorytype_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
        await queryRunner.query(`DROP TABLE "login_details"`);
    }

}
