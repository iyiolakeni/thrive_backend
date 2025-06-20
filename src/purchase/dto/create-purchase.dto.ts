import { ApiProperty } from "@nestjs/swagger";
import { PurchaseDto } from "./purchase.dto";
import { Type } from "class-transformer";

export class CreatePurchaseDto {
	@ApiProperty()
	userId: string;

	@ApiProperty({
		type: () => PurchaseDto, // Use a function here
		description: "Array of purchase data",
		isArray: true,
	})
	@Type(() => PurchaseDto) // Important for validation and transformation
	purchaseDto: PurchaseDto[];
}
