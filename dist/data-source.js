"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const business_entity_1 = require("./src/entities/business.entity/business.entity");
const logindetails_entity_1 = require("./src/entities/login.entity/logindetails.entity");
const password_entity_1 = require("./src/entities/user.entity/password.entity");
const user_entity_1 = require("./src/entities/user.entity/user.entity");
const product_category_entity_1 = require("./src/product-categories/entities/product-category.entity");
const product_entity_1 = require("./src/products/entities/product.entity");
const purchase_entity_1 = require("./src/purchase/entities/purchase.entity");
const transaction_detail_entity_1 = require("./src/transaction-details/entities/transaction-detail.entity");
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: true,
    entities: [
        user_entity_1.User,
        logindetails_entity_1.LoginDetails,
        password_entity_1.PasswordRest,
        product_category_entity_1.ProductCategory,
        business_entity_1.Business,
        product_entity_1.Product,
        purchase_entity_1.Purchase,
        transaction_detail_entity_1.TransactionDetail,
    ],
    migrations: ["src/migration/**/*.ts"],
    logging: true,
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map