import { ApiProperty } from "@nestjs/swagger";

export class BusinessVerificationDto {
	@ApiProperty()
	isVerified: boolean;

	@ApiProperty()
	verificationDate?: Date;
}
