"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const business_module_1 = require("./business/business.module");
const auth_module_1 = require("./auth/auth.module");
const catalog_module_1 = require("./catalog/catalog.module");
const logger_module_1 = require("./logger/logger.module");
const email_module_1 = require("./email/email.module");
const product_categories_module_1 = require("./product-categories/product-categories.module");
const products_module_1 = require("./products/products.module");
const shared_service_module_1 = require("./shared-service/shared-service.module");
const purchase_module_1 = require("./purchase/purchase.module");
const transaction_details_module_1 = require("./transaction-details/transaction-details.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            logger_module_1.LoggerModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                host: process.env.POSTGRES_HOST,
                port: 5432,
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DATABASE,
                ssl: true,
                autoLoadEntities: true,
                synchronize: false,
            }),
            user_module_1.UserModule,
            business_module_1.BusinessModule,
            auth_module_1.AuthModule,
            catalog_module_1.CatalogModule,
            logger_module_1.LoggerModule,
            email_module_1.EmailModule,
            product_categories_module_1.ProductCategoriesModule,
            products_module_1.ProductsModule,
            shared_service_module_1.SharedServiceModule,
            purchase_module_1.PurchaseModule,
            transaction_details_module_1.TransactionDetailsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map