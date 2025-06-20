import { ApiProperty } from "@nestjs/swagger";

export class PurchaseDto {
	@ApiProperty()
	quantity: number;

	@ApiProperty()
	productId: string;
}
