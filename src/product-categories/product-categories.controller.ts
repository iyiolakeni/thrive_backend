import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { ProductCategoriesService } from "./product-categories.service";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import { ApiTags } from "@nestjs/swagger";
import { SearchFilterDto } from "./dto/search-filter.dto";

@Controller("product-categories")
@ApiTags("Product Category")
export class ProductCategoriesController {
	constructor(
		private readonly productCategoriesService: ProductCategoriesService
	) {}

	@Post("create")
	create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
		return this.productCategoriesService.create(createProductCategoryDto);
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
