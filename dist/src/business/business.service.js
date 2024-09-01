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
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const business_entity_1 = require("../entities/business.entity/business.entity");
const typeorm_2 = require("typeorm");
let BusinessService = class BusinessService {
    constructor(businessRepo) {
        this.businessRepo = businessRepo;
    }
    async create(createBusinessDto) {
        const existingBusiness = await this.businessRepo.findOne({
            where: { businessName: createBusinessDto.businessName }
        });
        if (existingBusiness) {
            throw new common_1.ConflictException('Business Already Exist, try another user or reset password');
        }
        const business = this.businessRepo.create(createBusinessDto);
        return this.businessRepo.save(business);
    }
    getAllBusiness() {
        return this.businessRepo.find();
    }
    getBusiness(businessName) {
        return this.businessRepo.findOneBy({ businessName });
    }
    async updateBusiness(name, updateBusinessdto) {
        const business = await this.businessRepo.findOne({ where: { businessName: name } });
        if (!business) {
            throw new common_1.NotFoundException(`Business with name ${name} not found`);
        }
        Object.assign(business, updateBusinessdto);
        return this.businessRepo.save(business);
    }
    async deleteBusiness(businessName) {
        await this.businessRepo.delete(businessName);
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BusinessService);
//# sourceMappingURL=business.service.js.map