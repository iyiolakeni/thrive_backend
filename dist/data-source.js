"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const logindetails_entity_1 = require("./src/entities/login.entity/logindetails.entity");
const password_entity_1 = require("./src/entities/user.entity/password.entity");
const user_entity_1 = require("./src/entities/user.entity/user.entity");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "Thrive_DB",
    entities: [user_entity_1.User, logindetails_entity_1.LoginDetails, password_entity_1.PasswordRest],
    migrations: ["src/migration/**/*.ts"],
    logging: true,
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map