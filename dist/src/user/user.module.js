"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity/user.entity");
const logindetails_entity_1 = require("../entities/login.entity/logindetails.entity");
const shared_service_service_1 = require("../shared-service/shared-service.service");
const password_entity_1 = require("../entities/user.entity/password.entity");
const email_service_1 = require("../email/email.service");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, logindetails_entity_1.LoginDetails, password_entity_1.PasswordRest])],
        providers: [user_service_1.UserService, shared_service_service_1.SharedService, email_service_1.EmailService],
        controllers: [user_controller_1.UserController],
        exports: [
            user_service_1.UserService,
            shared_service_service_1.SharedService,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, logindetails_entity_1.LoginDetails]),
        ],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map