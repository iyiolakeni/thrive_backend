import { ApiProperty } from "@nestjs/swagger";

export class SearchFilterDto {
	@ApiProperty({ required: false })
	searchTerm?: string;
	@ApiProperty({ required: false })
	categoryType?: string;

	@ApiProperty({ required: false })
	page?: number;
	@ApiProperty({ required: false })
	limit?: number;
	@ApiProperty({ required: false })
	sortBy?: string;
	@ApiProperty({ required: false })
	sortOrder?: "ASC" | "DESC";
}
