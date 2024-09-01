"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const otpGenerator = require("otp-generator");
let OtpService = class OtpService {
    constructor() {
        this.otpStore = new Map();
    }
    generateOtp(phone) {
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        this.otpStore.set(phone, otp);
        setTimeout(() => this.otpStore.delete(phone), 300000);
        return otp;
    }
    verifyOtp(phone, otp) {
        const storedOtp = this.otpStore.get(phone);
        if (storedOtp === otp) {
            this.otpStore.delete(phone);
            return true;
        }
        return false;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)()
], OtpService);
//# sourceMappingURL=otp.service.js.map