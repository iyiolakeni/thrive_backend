import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDetailsDto {
	userId: string;
	ipAddress: string;
	deviceInfo: string;
	userAgent: string;
	loginSuccess: boolean;
}
