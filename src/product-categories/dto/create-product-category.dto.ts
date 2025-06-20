import { ApiProperty } from "@nestjs/swagger";
import { ProductCategoryType } from "src/entities/enum";

export class CreateProductCategoryDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	description?: string;

	@ApiProperty({
		enum: ProductCategoryType,
		enumName: "ProductCategoryType",
		default: ProductCategoryType.DIGITAL,
	})
	categoryType?: ProductCategoryType;

	isActive?: boolean;
}
