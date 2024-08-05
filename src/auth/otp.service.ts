// src/auth/otp.service.ts
import { Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';

@Injectable()
export class OtpService {
  private otpStore: Map<string, string> = new Map();

  generateOtp(phone: string): string {
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
    this.otpStore.set(phone, otp);

    setTimeout(() => this.otpStore.delete(phone), 300000);
    return otp;
  }

  verifyOtp(phone: string, otp: string): boolean {
    const storedOtp = this.otpStore.get(phone);
    if (storedOtp === otp) {
      this.otpStore.delete(phone);
      return true;
    }
    return false;
  }
}
