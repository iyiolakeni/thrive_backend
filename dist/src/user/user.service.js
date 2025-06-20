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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const response_dto_1 = require("../models/response.dto");
const common_1 = require("@nestjs/common");
const password_entity_1 = require("../entities/user.entity/password.entity");
const email_service_1 = require("../email/email.service");
let UserService = UserService_1 = class UserService {
    constructor(userRepo, passwordResetRepo, emailService) {
        this.userRepo = userRepo;
        this.passwordResetRepo = passwordResetRepo;
        this.emailService = emailService;
        this.logger = new common_1.Logger(UserService_1.name);
        this.url = process.env.FRONT_END_URL;
        this.secret = Buffer.from(process.env.SECRET_KEY, "hex");
    }
    async findOneByEmail(email) {
        return this.userRepo.findOneBy({ email });
    }
    async create(createUserDto) {
        const existingUser = await this.userRepo.findOne({
            where: { username: createUserDto.username },
        });
        console.log("User's date of birth: ", createUserDto.dob);
        const dobDate = createUserDto.dob instanceof Date
            ? createUserDto.dob
            : new Date(createUserDto.dob);
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        console.log("Current date minus 18 years: ", eighteenYearsAgo);
        console.log("Parsed DOB: ", dobDate);
        if (dobDate > eighteenYearsAgo) {
            throw new response_dto_1.ErrorResponse("User must be at least 18 years old", "User is under 18 years old", 410);
        }
        if (existingUser) {
            throw new response_dto_1.ConflictResponse("Username already taken, kinldy try another username");
        }
        const token = this.generateToken(createUserDto.email);
        this.logger.log(`Generated token for user ${createUserDto.email}: ${token}`);
        const sendEmail = await this.emailService.sendEmail({
            to: createUserDto.email,
            subject: "Verify Your Email Address",
            templateName: "verify_email",
            context: {
                userName: createUserDto.firstName,
                companyName: "Thrive",
                currentYear: new Date().getFullYear(),
                companyAddress: "123 Thrive St, Thrive City, TC 12345",
                supportEmail: "" + process.env.SUPPORT_EMAIL,
                verificationUrl: `${this.url}?token=${token}`,
            },
        });
        this.logger.log("Email sent response: ", sendEmail);
        if (sendEmail instanceof response_dto_1.ErrorResponse) {
            return new response_dto_1.ErrorResponse("Failed to send verification email", "Email Sending Error", 500);
        }
        const salt = await bcrypt.genSalt();
        const user = this.userRepo.create(createUserDto);
        if (createUserDto.password) {
            user.password = await bcrypt.hash(user.password, salt);
        }
        await this.userRepo.save(user);
        this.logger.log(`User ${user.username} created successfully`);
        return new response_dto_1.SuccessResponse("User created successfully. Please check your email to verify your account.");
    }
    getAllUsers() {
        return this.userRepo.find();
    }
    getUser(username) {
        return this.userRepo.findOneBy({ username });
    }
    async updateUser(username, updateuserDto) {
        await this.userRepo.update(username, updateuserDto);
        return this.userRepo.findOneBy({ username });
    }
    async deleteUser(username) {
        if (typeof username !== "string" || username.trim() === "") {
            throw new response_dto_1.InvalidCredentialsResponse("Invalid username", "Username must be a non-empty string", 401);
        }
        const user = await this.userRepo.findOne({ where: { username } });
        console.log(user);
        if (!user) {
            throw new response_dto_1.NotFoundResponse("User not found");
        }
        await this.userRepo.delete({ username });
        console.log(user);
    }
    async forgetPassword(email) {
        this.logger.log(`Request to reset password for email: ${email}`);
        if (!email || typeof email !== "string" || email.trim() === "") {
            this.logger.error("Invalid email provided for password reset");
            return new response_dto_1.InvalidCredentialsResponse("Invalid email", "Email must be a non-empty string", 401);
        }
        const user = await this.userRepo.findOneBy({ email });
        if (!user) {
            this.logger.log(`User with email ${email} not found`);
            return new response_dto_1.NotFoundResponse("User not found");
        }
        this.logger.log(`User with email ${email} found, sending reset email`);
        const uniqueToken = this.generateToken(email);
        this.logger.log(`Generated token for ${email}: ${uniqueToken}`);
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1);
        const password_reset = this.passwordResetRepo.create({
            email: email,
            resetToken: uniqueToken,
            expirationDate: expirationDate,
            isUsed: false,
            userId: user.id,
        });
        await this.passwordResetRepo.save(password_reset);
        this.logger.log(`Password reset token saved for user ${user.username}`);
        this.logger.log(`Sending reset password email to ${email}`);
        const response = await this.emailService.sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            templateName: "password_rest",
            context: {
                name: user.username,
                resetLink: `${this.url}}/reset-password?token=${uniqueToken}`,
            },
        });
        this.logger.log("Email response received", response);
        if (response instanceof response_dto_1.ErrorResponse) {
            this.logger.error(`Failed to send reset password email: ${response.message}`);
            return response;
        }
        this.logger.log(`Reset password email sent to ${email}`);
        return new response_dto_1.SuccessResponse("Password reset email sent");
    }
    generateToken(email) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv("aes-256-gcm", this.secret, iv);
        let encrypted = cipher.update(email, "utf8", "base64");
        encrypted += cipher.final("base64");
        const tag = cipher.getAuthTag().toString("base64");
        return `${iv.toString("base64")}.${tag}.${encrypted}`;
    }
    verifyToken(token) {
        const [iv64, tag64, encrypted] = token.split(".");
        if (!iv64 || !tag64 || !encrypted) {
            this.logger.error("Invalid token format");
            return new response_dto_1.InvalidCredentialsResponse("Invalid token", "Token must be a valid encrypted string", 401);
        }
        const iv = Buffer.from(iv64, "base64");
        const tag = Buffer.from(tag64, "base64");
        if (iv.length !== 12 || tag.length !== 16) {
            this.logger.error("Invalid IV or tag length");
            return new response_dto_1.InvalidCredentialsResponse("Invalid token", "IV or tag must be of correct length", 401);
        }
        this.logger.log(`Decrypting token with IV: ${iv64} and tag: ${tag64}`);
        try {
            const decipher = crypto.createDecipheriv("aes-256-gcm", this.secret, iv);
            decipher.setAuthTag(tag);
            let decrypted = decipher.update(encrypted, "base64", "utf8");
            decrypted += decipher.final("utf8");
            this.logger.log(`Decrypted email: ${decrypted}`);
            return decrypted;
        }
        catch (error) {
            this.logger.error("Failed to decrypt token", error);
            return new response_dto_1.InvalidCredentialsResponse("Invalid token", "Token must be a valid encrypted string", 401);
        }
    }
    async resetPassword(resetDetails) {
        this.logger.log(`Request to reset password with token: ${resetDetails.token}`);
        const emailResult = this.verifyToken(resetDetails.token);
        const passwordRepos = await this.passwordResetRepo.findOne({
            where: { resetToken: resetDetails.token, isUsed: false },
        });
        if (!passwordRepos) {
            this.logger.error("Invalid or expired token provided for password reset");
            return new response_dto_1.InvalidCredentialsResponse("Invalid or expired token", "Token must be valid and not used", 401);
        }
        if (passwordRepos.expirationDate < new Date()) {
            this.logger.error("Token has expired - tokens are only valid for 1 hour");
            return new response_dto_1.InvalidCredentialsResponse("Token expired", "Password reset token has expired. Please request a new one.", 401);
        }
        if (passwordRepos.isUsed) {
            this.logger.error("Token has already been used");
            return new response_dto_1.InvalidCredentialsResponse("Token already used", "Token must be valid and not used", 401);
        }
        if (emailResult instanceof response_dto_1.InvalidCredentialsResponse) {
            this.logger.error("Invalid token provided for password reset");
            return emailResult;
        }
        const user = await this.userRepo.findOneBy({ email: emailResult });
        if (!user) {
            this.logger.log(`User with email ${emailResult} not found`);
            return new response_dto_1.NotFoundResponse("User not found");
        }
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(resetDetails.newPassword, salt);
        await this.userRepo.update(user.id, { password: user.password });
        await this.passwordResetRepo.update(passwordRepos.id, {
            isUsed: true,
        });
        await this.emailService.sendEmail({
            to: user.email,
            subject: "Password Reset Confirmation",
            templateName: "reset_successful",
            context: {
                userName: user.firstName,
                companyName: "Thrive",
                currentYear: new Date().getFullYear(),
                companyAddress: "123 Thrive St, Thrive City, TC 12345",
                supportEmail: "iyiolakeni@gmail.com",
            },
        });
        this.logger.log(`Password reset successfully for user ${user.username}`);
        return new response_dto_1.SuccessResponse("Password reset successfully");
    }
    async getUserById(id) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            this.logger.error(`User with ID ${id} not found`);
            return new response_dto_1.NotFoundResponse("User not found");
        }
        return user;
    }
    async verifyUser(token) {
        this.logger.log(`Verifying user with token: ${token}`);
        const email = this.verifyToken(token);
        if (email instanceof response_dto_1.InvalidCredentialsResponse) {
            this.logger.error("Invalid token provided for user verification");
            return new response_dto_1.InvalidCredentialsResponse("Unverified User", "User verification failed. Invalid token.", 401);
        }
        const user = await this.userRepo.findOneBy({ email });
        if (user.isVerified) {
            this.logger.warn(`User with email ${email} is already verified`);
            return new response_dto_1.NotFoundResponse("User already verified", "User Verification Error");
        }
        if (!user) {
            this.logger.error(`User with email ${email} not found`);
            return new response_dto_1.NotFoundResponse("User not found");
        }
        if (user.isVerified) {
            this.logger.warn(`User with email ${email} is already verified`);
            return new response_dto_1.NotFoundResponse("User already verified");
        }
        user.isVerified = true;
        await this.userRepo.update(user.id, { isVerified: true });
        this.logger.log(`User with email ${email} verified successfully`);
        return {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
    }
    async search(searchFilter) {
        this.logger.log(`Searching users with filter: ${JSON.stringify(searchFilter)}`);
        const { searchTerm, sortBy, sortOrder, page, limit } = searchFilter;
        const queryBuilder = this.userRepo.createQueryBuilder("user");
        if (searchTerm) {
            queryBuilder.where("user.username LIKE :searchTerm", {
                searchTerm: `%${searchTerm}%`,
            });
        }
        if (page && limit) {
            queryBuilder.skip((page - 1) * limit).take(limit);
        }
        if (sortBy && sortOrder) {
            if (!["ASC", "DESC"].includes(sortOrder.toUpperCase())) {
                this.logger.error("Invalid sort order provided");
                return new response_dto_1.ErrorResponse("Invalid sort order. Use 'ASC' or 'DESC'.", "Sort Order Error", 400);
            }
            if (!["username", "email", "phoneNo"].includes(sortBy)) {
                this.logger.error("Invalid sort field provided");
                return new response_dto_1.ErrorResponse("Invalid sort field. Use 'username', 'email', or 'phoneNo'.", "Invalid Sort Field", 400);
            }
            queryBuilder.orderBy(`user.${sortBy}`, sortOrder.toUpperCase());
        }
        const [users, total] = await queryBuilder.getManyAndCount();
        if (users.length === 0) {
            this.logger.warn("No users found matching the search criteria");
            return new response_dto_1.ErrorResponse("No users found", "Search Error", 404);
        }
        this.logger.log(`Found ${users.length} users matching the search criteria`);
        return new response_dto_1.SearchResponse(users, {
            total,
            page: page || 1,
            limit: limit || 10,
            totalPages: Math.ceil(total / (limit || 10)),
        }, "User Search Results", 200);
    }
    async activateUser(username) {
        this.logger.log(`Activating user with username: ${username}`);
        const user = await this.userRepo.findOneBy({ username });
        if (!user) {
            this.logger.error(`User with username ${username} not found`);
            return new response_dto_1.NotFoundResponse("User not found");
        }
        user.isActive = true;
        await this.userRepo.update(user.id, { isActive: true });
        this.logger.log(`User ${username} activated successfully`);
        return user;
    }
    async deactivateUser(username) {
        this.logger.log(`Deactivating user with username: ${username}`);
        const user = await this.userRepo.findOneBy({ username });
        if (!user) {
            this.logger.error(`User with username ${username} not found`);
            return new response_dto_1.NotFoundResponse("User not found");
        }
        user.isActive = false;
        await this.userRepo.update(user.id, { isActive: false });
        this.logger.log(`User ${username} deactivated successfully`);
        return user;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(password_entity_1.PasswordRest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], UserService);
//# sourceMappingURL=user.service.js.map