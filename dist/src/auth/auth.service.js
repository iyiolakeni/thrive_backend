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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const response_dto_1 = require("../models/response.dto");
const config_1 = require("@nestjs/config");
const shared_service_service_1 = require("../shared-service/shared-service.service");
const typeorm_1 = require("@nestjs/typeorm");
const logindetails_entity_1 = require("../entities/login.entity/logindetails.entity");
const typeorm_2 = require("typeorm");
const logindetails_dto_1 = require("../user/dto/logindetails.dto");
let AuthService = class AuthService {
    constructor(sharedService, jwtService, configService, loginDetailsRepo) {
        this.sharedService = sharedService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.loginDetailsRepo = loginDetailsRepo;
    }
    async validateUser(email, password) {
        const user = await this.sharedService.findOneByEmail(email);
        if (user instanceof response_dto_1.NotFoundResponse) {
            return new response_dto_1.NotFoundResponse("User not found");
        }
        const foundUser = user instanceof response_dto_1.DataResponse ? user.data : null;
        if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
            const { password, ...result } = foundUser;
            return new response_dto_1.DataResponse(result, "User found");
        }
        else {
            return new response_dto_1.InvalidCredentialsResponse("Invalid credentials", "Unauthorized", foundUser.id);
        }
    }
    async login(loginDto, meta) {
        const response = await this.validateUser(loginDto.email, loginDto.password);
        console.log("Login response:", response);
        if (response instanceof response_dto_1.InvalidCredentialsResponse) {
            await this.saveLoginDetails(response.userId, meta, response);
            throw new response_dto_1.InvalidCredentialsResponse("Invalid credentials", "Unauthorized", "");
        }
        if (response instanceof response_dto_1.NotFoundResponse) {
            throw new response_dto_1.NotFoundResponse("User not found");
        }
        const user = response.data;
        const payload = {
            email: user.email,
            sub: user.id,
        };
        await this.saveLoginDetails(user.id, meta, response);
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: "15m",
            secret: this.configService.get("JWT_SECRET"),
        });
        return new response_dto_1.LoginResponse(accessToken, "Login successful");
    }
    saveLoginDetails(userId, meta, response) {
        const loginDetails = new logindetails_dto_1.LoginDetailsDto();
        loginDetails.userId = userId;
        loginDetails.ipAddress = meta.ipAddress;
        loginDetails.userAgent = meta.userAgent;
        loginDetails.deviceInfo = meta.deviceInfo;
        loginDetails.loginSuccess = response.statusCode === 200 ? true : false;
        console.log("Login details:", meta.location);
        const loginDetailsEntity = this.loginDetailsRepo.create(loginDetails);
        return this.loginDetailsRepo.save(loginDetailsEntity);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(logindetails_entity_1.LoginDetails)),
    __metadata("design:paramtypes", [shared_service_service_1.SharedService,
        jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map