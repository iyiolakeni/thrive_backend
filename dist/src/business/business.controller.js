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
exports.BusinessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const business_service_1 = require("./business.service");
const create_business_dto_1 = require("./dto/create-business.dto/create-business.dto");
const update_business_dto_1 = require("./dto/update-business.dto/update-business.dto");
let BusinessController = class BusinessController {
    constructor(businessService) {
        this.businessService = businessService;
    }
    async create(createbusinessDto) {
        try {
            return this.businessService.create(createbusinessDto);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw new common_1.HttpException("Business Already Exist, try another or reset details", common_1.HttpStatus.CONFLICT);
            }
            throw error;
        }
    }
    getAllBusiness() {
        return this.businessService.getAllBusiness();
    }
    async getBusinessDetails(businessName) {
        return this.businessService.getBusiness(businessName);
    }
    async updateBusiness(businessName, updateBusinessDto) {
        return this.businessService.updateBusiness(businessName, updateBusinessDto);
    }
    async deleteBusiness(businessName) {
        return this.businessService.deleteBusiness(businessName);
    }
    async verifyBusiness(id) {
        return this.businessService.verifyBusiness(id);
    }
    async activateBusiness(id) {
        return this.businessService.activateBusiness(id);
    }
    async deactivateBusiness(id) {
        return this.businessService.deactivateBusiness(id);
    }
    async getAllBanks() {
        return this.businessService.getAllBanks();
    }
};
exports.BusinessController = BusinessController;
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_business_dto_1.CreateBusinessDto]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getAllBusiness", null);
__decorate([
    (0, common_1.Get)(":businessName"),
    __param(0, (0, common_1.Param)("businessName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getBusinessDetails", null);
__decorate([
    (0, common_1.Patch)(":businessName"),
    __param(0, (0, common_1.Param)("businessName")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_business_dto_1.UpdateBusinessDto]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "updateBusiness", null);
__decorate([
    (0, common_1.Delete)(":businessName"),
    __param(0, (0, common_1.Param)("businessName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "deleteBusiness", null);
__decorate([
    (0, common_1.Patch)("verify-business/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "verifyBusiness", null);
__decorate([
    (0, common_1.Patch)("activate-business/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "activateBusiness", null);
__decorate([
    (0, common_1.Patch)("deactivate-business/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "deactivateBusiness", null);
__decorate([
    (0, common_1.Post)("banks"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getAllBanks", null);
exports.BusinessController = BusinessController = __decorate([
    (0, common_1.Controller)("Business"),
    (0, swagger_1.ApiTags)("Business Details"),
    __metadata("design:paramtypes", [business_service_1.BusinessService])
], BusinessController);
//# sourceMappingURL=business.controller.js.map