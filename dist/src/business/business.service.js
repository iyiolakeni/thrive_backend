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
var BusinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const business_entity_1 = require("../entities/business.entity/business.entity");
const typeorm_2 = require("typeorm");
const shared_service_service_1 = require("../shared-service/shared-service.service");
const response_dto_1 = require("../models/response.dto");
const axios_1 = require("axios");
let BusinessService = BusinessService_1 = class BusinessService {
    constructor(businessRepo, sharedService) {
        this.businessRepo = businessRepo;
        this.sharedService = sharedService;
        this.logger = new common_1.Logger(BusinessService_1.name);
        this.paystackUrl = process.env.PAYSTACK_URL;
        this.headers = {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        };
    }
    async create(createBusinessDto) {
        if (!createBusinessDto) {
            this.logger.error("Invalid business data provided");
            return new response_dto_1.InvalidCredentialsResponse("Invalid business data provided", "Invalid Details", 400);
        }
        const user = await this.sharedService.findOneByEmail(createBusinessDto.email);
        this.logger.log(`User fetched for email ${createBusinessDto.email}: ${JSON.stringify(user)}`);
        if (!user || "error" in user) {
            this.logger.error(`User with email ${createBusinessDto.email} not found`);
            throw new response_dto_1.NotFoundResponse(`User with email ${createBusinessDto.email} not found`);
        }
        const foundUser = user instanceof response_dto_1.DataResponse ? user.data : null;
        if (foundUser.userType !== "VENDOR") {
            this.logger.error(`User with email ${createBusinessDto.email} is not registered as a business`);
            return new response_dto_1.InvalidCredentialsResponse("User is not registered as a business", "Invalid Role", 400);
        }
        const existingBusiness = await this.businessRepo.findOne({
            where: { businessName: createBusinessDto.businessName },
        });
        if (existingBusiness) {
            this.logger.error(`Business with name ${createBusinessDto.businessName} already exists`);
            throw new common_1.ConflictException("Business Already Exist, try another user or reset password");
        }
        this.logger.log("Validating bank account details");
        const validBankAccount = await this.verifyAccount(createBusinessDto.bankAccountNumber, createBusinessDto.bank_code);
        if (validBankAccount instanceof response_dto_1.InvalidCredentialsResponse) {
            this.logger.error(`Invalid bank account details provided: ${validBankAccount.message}`);
            return validBankAccount;
        }
        this.logger.log("Creating sub-account for business");
        const createSubAccountResponse = await this.createSubAccount(createBusinessDto.businessName, createBusinessDto.bank_code, createBusinessDto.bankAccountNumber, createBusinessDto.email);
        if (createSubAccountResponse instanceof response_dto_1.NotFoundResponse) {
            this.logger.error(`Failed to create sub-account: ${createSubAccountResponse.message}`);
            return createSubAccountResponse;
        }
        if (createSubAccountResponse instanceof response_dto_1.InvalidCredentialsResponse) {
            this.logger.error(`Failed to create sub-account: ${createSubAccountResponse.message}`);
            return createSubAccountResponse;
        }
        this.logger.log(`Sub-account created successfully: ${JSON.stringify(createSubAccountResponse.data, null, 2)}`);
        const business = this.businessRepo.create({
            ...createBusinessDto,
            userId: foundUser.id,
            bankName: createSubAccountResponse.data.data.settlement_bank,
        });
        try {
            await this.businessRepo.save(business);
        }
        catch (error) {
            this.logger.error(`Error creating business: ${error.message}`, error.stack);
            throw new common_1.ConflictException("Error creating business");
        }
        return new response_dto_1.SuccessResponse("Business created successfully", 200);
    }
    async getAllBusiness() {
        const business = await this.businessRepo.find();
        return new response_dto_1.DataResponse(business, "All Businesses fetched successfully", 200);
    }
    async getBusiness(name) {
        const business = await this.businessRepo.findOneBy({ businessName: name });
        if (!business) {
            return new response_dto_1.NotFoundResponse(`Business with id ${name} not found`);
        }
        return new response_dto_1.DataResponse(business, "Business fetched successfully", 200);
    }
    async getAllBanks() {
        this.logger.log("Fetching all banks from Paystack");
        this.logger.log("Using Paystack URL:", this.paystackUrl);
        try {
            const response = await axios_1.default.get(`${this.paystackUrl}/bank`, {
                headers: this.headers,
            });
            if (response.data.status) {
                this.logger.log("Banks fetched successfully from Paystack");
                this.logger.log("Response data Length:", JSON.stringify(response.data.data.length));
                return new response_dto_1.DataResponse(response.data.data, "All Banks fetched successfully", 200);
            }
            else {
                this.logger.error("Failed to fetch banks from Paystack");
                return new response_dto_1.NotFoundResponse("Failed to fetch banks from Paystack");
            }
        }
        catch (error) {
            this.logger.error(`Error fetching banks: ${error.message}`);
            return new response_dto_1.NotFoundResponse(`Error fetching banks: ${error.message}`);
        }
    }
    async updateBusiness(name, updateBusinessdto) {
        const business = await this.businessRepo.findOne({
            where: { businessName: name },
        });
        if (!business) {
            throw new common_1.NotFoundException(`Business with name ${name} not found`);
        }
        Object.assign(business, updateBusinessdto);
        return this.businessRepo.save(business);
    }
    async deleteBusiness(businessName) {
        await this.businessRepo.delete(businessName);
    }
    async verifyBusiness(id) {
        const business = await this.businessRepo.findOne({ where: { id } });
        if (!business) {
            return new response_dto_1.NotFoundResponse(`Business with id ${id} not found`);
        }
        business.isVerified = true;
        business.verificationDate = new Date();
        await this.businessRepo.save(business);
        return new response_dto_1.SuccessResponse("Business verified successfully", 200);
    }
    async activateBusiness(id) {
        const business = await this.businessRepo.findOne({ where: { id } });
        if (!business) {
            return new response_dto_1.NotFoundResponse(`Business with id ${id} not found`);
        }
        business.isActive = false;
        business.modificationDate = null;
        await this.businessRepo.save(business);
        return new response_dto_1.SuccessResponse("Business deactivated successfully", 200);
    }
    async deactivateBusiness(id) {
        const business = await this.businessRepo.findOne({ where: { id } });
        if (!business) {
            return new response_dto_1.NotFoundResponse(`Business with id ${id} not found`);
        }
        business.isActive = false;
        business.modificationDate = null;
        await this.businessRepo.save(business);
        return new response_dto_1.SuccessResponse("Business deactivated successfully", 200);
    }
    async verifyAccount(accountNumber, bankCode) {
        this.logger.log(`Verifying account with number ${accountNumber} and bank code ${bankCode}`);
        if (!accountNumber || !bankCode) {
            this.logger.error("Account number and bank code are required for verification");
            return new response_dto_1.NotFoundResponse("Account number and bank code are required");
        }
        const url = `${this.paystackUrl}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
        try {
            const response = await axios_1.default.get(url, { headers: this.headers });
            this.logger.log(`Account verification response: ${response.data}`);
            if (response.data.status) {
                return new response_dto_1.DataResponse(response.data, "Account verified successfully", 200);
            }
            else {
                return new response_dto_1.NotFoundResponse("Account verification failed");
            }
        }
        catch (error) {
            this.logger.error(`${error}`);
            this.logger.error(`Error verifying account: ${error.message}`);
            if (axios_1.default.isAxiosError(error)) {
                this.logger.error("Axios error occurred", error.message);
                return new response_dto_1.InvalidCredentialsResponse("Unabale to Verify User Account", error.message, 500);
            }
            else {
                this.logger.error("Unexpected error occurred", error);
                return new response_dto_1.InvalidCredentialsResponse("Account Number Verification Failed failed", "An unexpected error occurred", 500);
            }
        }
    }
    async createSubAccount(business_name, bank_code, account_number, primary_contact_email) {
        this.logger.log(`Creating sub-account for business ${business_name} with bank code ${bank_code} and account number ${account_number}`);
        if (!business_name || !bank_code || !account_number) {
            this.logger.error("Business name, bank code, and account number are required");
            return new response_dto_1.NotFoundResponse("Business name, bank code, and account number are required");
        }
        const url = `${this.paystackUrl}/subaccount`;
        const data = {
            business_name,
            bank_code,
            account_number,
            primary_contact_email,
            percentage_charge: 15,
        };
        try {
            const response = await axios_1.default.post(url, data, { headers: this.headers });
            this.logger.log(`Sub-account creation response: ${response.data}`);
            if (response.data.status) {
                this.logger.log(`Sub-account for business ${business_name} created successfully`);
                return new response_dto_1.DataResponse(response.data, "Sub-account created successfully", 200);
            }
            else {
                return new response_dto_1.InvalidCredentialsResponse("Sub-account creation failed", "Unable to Create", 400);
            }
        }
        catch (error) {
            this.logger.error(`Error creating sub-account: ${error.message}`);
            return new response_dto_1.NotFoundResponse(`Error creating sub-account: ${error.message}`);
        }
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = BusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(business_entity_1.Business)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        shared_service_service_1.SharedService])
], BusinessService);
//# sourceMappingURL=business.service.js.map