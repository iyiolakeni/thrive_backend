import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class CreateBusinessDto {
	// Business Information
	@ApiProperty()
	businessName: string;

	@ApiProperty()
	businessAddress: string;

	@ApiProperty()
	registrationNumber?: string;

	@ApiProperty({ nullable: true })
	storeLogo?: string; // Assume it's a URL or file path

	@ApiProperty()
	bankAccountNumber: string;

	@ApiProperty()
	bank_code: string;

	// Legal and Compliance
	@ApiProperty({ default: true })
	vendorAgreement: boolean;

	// Shipping and Return Policy
	@ApiProperty({ default: true })
	returnPolicy: boolean;

	@ApiProperty()
	email: string;
}
