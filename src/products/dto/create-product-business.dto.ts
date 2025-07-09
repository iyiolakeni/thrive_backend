import { ApiProperty } from "@nestjs/swagger";

export class CreateBusinessProductDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	unitPrice: number;

	@ApiProperty()
	stock: number;

	@ApiProperty({ required: false })
	imageUrl?: string;

	@ApiProperty({ required: false })
	discount?: number;

	@ApiProperty()
	categoryId: string;
}
