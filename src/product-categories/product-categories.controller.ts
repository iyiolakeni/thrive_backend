import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Headers,
} from "@nestjs/common";
import { ProductCategoriesService } from "./product-categories.service";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { SearchFilterDto } from "./dto/search-filter.dto";
import { BadRequestResponse } from "src/models/response.dto";
import { TokenService } from "src/shared-service/toekn-service.service";

@Controller("product-categories")
@ApiTags("Product Category")
// @ApiBearerAuth("access-token")
export class ProductCategoriesController {
	constructor(
		private readonly productCategoriesService: ProductCategoriesService,
		private readonly tokenService: TokenService
	) {}

	@Post("create")
	// @ApiHeader({
	// 	name: "authorization",
	// 	required: true,
	// 	description: "Bearer token for authentication",
	// })
	async create(
		@Body() createProductCategoryDto: CreateProductCategoryDto,
		@Headers("Authorization") authorization: string
	) {
		const token = await this.tokenService.extractToken(authorization);
		return this.productCategoriesService.create(
			createProductCategoryDto,
			token
		);
	}

	@Post("bulk-create")
	// @ApiHeader({
	// 	name: "authorization",
	// 	required: true,
	// 	description: "Bearer token for authentication",
	// })
	async bulkCreate(
		@Body() createProductCategoryDtos: CreateProductCategoryDto[],
		@Headers("Authorization") authorization: string
	) {
		const token = await this.tokenService.extractToken(authorization);
		return this.productCategoriesService.createBulk(
			createProductCategoryDtos,
			token
		);
	}

	@Get("all")
	findAll() {
		return this.productCategoriesService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.productCategoriesService.findOne(id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateProductCategoryDto: UpdateProductCategoryDto
	) {
		return this.productCategoriesService.update(id, updateProductCategoryDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.productCategoriesService.remove(id);
	}

	@Post("activate/:id")
	activate(@Param("id") id: string) {
		return this.productCategoriesService.activate(id);
	}

	@Post("deactivate/:id")
	deactivate(@Param("id") id: string) {
		return this.productCategoriesService.deactivate(id);
	}

	@Post("search")
	search(@Body() searchFilterDto: SearchFilterDto) {
		return this.productCategoriesService.search(searchFilterDto);
	}
}
