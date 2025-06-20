import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import {
	DataResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SuccessResponse,
} from "src/models/response.dto";
import { Product } from "./entities/product.entity";

@Controller("products")
@ApiTags("Products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post("create")
	async create(
		@Body() createProductDto: CreateProductDto
	): Promise<SuccessResponse | InvalidCredentialsResponse> {
		return this.productsService.create(createProductDto);
	}

	@Get("all")
	async findAll(): Promise<DataResponse<Product[]> | NotFoundResponse> {
		return this.productsService.findAll();
	}

	@Get("get-all/:id")
	async findOne(
		@Param("id") id: string
	): Promise<DataResponse<Product> | NotFoundResponse> {
		return this.productsService.findOne(id);
	}

	@Patch("update/:id")
	async update(
		@Param("id") id: string,
		@Body() updateProductDto: UpdateProductDto
	): Promise<SuccessResponse | NotFoundResponse> {
		return this.productsService.update(id, updateProductDto);
	}

	@Delete("delete/:id")
	remove(@Param("id") id: string) {
		return this.productsService.remove(id);
	}

	@Post("restock/:id")
	@ApiBody({ schema: { properties: { quantity: { type: "number" } } } })
	async restock(
		@Param("id") id: string,
		@Body("quantity") quantity: number
	): Promise<SuccessResponse | NotFoundResponse> {
		return this.productsService.reStockProduct(id, quantity);
	}
}
