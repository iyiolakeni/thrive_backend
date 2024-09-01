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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async findOneByEmail(email) {
        return this.userRepo.findOneBy({ email });
    }
    async create(createUserDto) {
        const existingUser = await this.userRepo.findOne({
            where: { username: createUserDto.username }
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username already taken, kinldy try another username');
        }
        const user = this.userRepo.create(createUserDto);
        const salt = await bcrypt.genSalt();
        if (createUserDto.password) {
            user.password = await bcrypt.hash(user.password, salt);
        }
        return this.userRepo.save(user);
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
        if (typeof username !== 'string' || username.trim() === '') {
            throw new common_1.BadRequestException('Invalid username');
        }
        const user = await this.userRepo.findOne({ where: { username } });
        console.log(user);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.userRepo.delete({ username });
        console.log(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map