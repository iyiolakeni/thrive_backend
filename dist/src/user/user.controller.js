"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./dto/create-user.dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto/update-user.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const email_dto_1 = require("../email/dto/email.dto");
const reset_password_dto_1 = require("./dto/reset_password.dto");
const search_filter_dto_1 = require("../product-categories/dto/search-filter.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(createUserdto) {
        try {
            return this.userService.create(createUserdto);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw new common_1.HttpException("Username already exists", common_1.HttpStatus.CONFLICT);
            }
            throw error;
        }
    }
    getAllusers() {
        return this.userService.getAllUsers();
    }
    async getUser(username) {
        return this.userService.getUser(username);
    }
    async updateUser(username, updateUserDto) {
        return this.userService.updateUser(username, updateUserDto);
    }
    async deleteUser(username) {
        return this.userService.deleteUser(username);
    }
    async resetPasword(email) {
        return this.userService.forgetPassword(email.email);
    }
    async resetPassword(resetDetails) {
        return this.userService.resetPassword(resetDetails);
    }
    async getUserById(id) {
        return this.userService.getUserById(id);
    }
    async searchUser(searchFilter) {
        return this.userService.search(searchFilter);
    }
    async activateUser(username) {
        return this.userService.activateUser(username);
    }
    async deactivateUser(username) {
        return this.userService.deactivateUser(username);
    }
    async verifyEmail(token) {
        return this.userService.verifyUser(token);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllusers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAwthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)("get-user/:username"),
    __param(0, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)("update/:username"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAwthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)("username")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)("delete/:username"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAwthGuard),
    __param(0, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)("forget-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_dto_1.EmailDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPasword", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)("get-user/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Post)("search"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_filter_dto_1.SearchFilterDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUser", null);
__decorate([
    (0, common_1.Post)("activate/:username"),
    __param(0, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "activateUser", null);
__decorate([
    (0, common_1.Post)("deactivate/:username"),
    __param(0, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deactivateUser", null);
__decorate([
    (0, common_1.Post)("verify-email/:token"),
    __param(0, (0, common_1.Param)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyEmail", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("User"),
    (0, swagger_1.ApiTags)("User Details"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map