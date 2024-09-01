"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const business_entity_1 = require("./src/entities/business.entity/business.entity");
const catalog_entity_1 = require("./src/entities/catalog.entity/catalog.entity");
const user_entity_1 = require("./src/entities/user.entity/user.entity");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'ep-lucky-frost-a402y3x7-pooler.us-east-1.aws.neon.tech',
    port: 5432,
    username: 'default',
    password: 'pguX9yMWco8T',
    database: 'verceldb',
    url: 'postgres://default:pguX9yMWco8T@ep-lucky-frost-a402y3x7-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require',
    entities: [user_entity_1.User, business_entity_1.Business, catalog_entity_1.Catalog],
    migrations: ['src/migration/**/*.js'],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map