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
import { Product } from "./entities/products.entity";
import { TokenService } from "src/shared-service/toekn-service.service";

@Controller("products")
@ApiTags("Products")
export class ProductsController {
	constructor(
		private readonly productsService: ProductsService,
		private readonly tokenServie: TokenService
	) {}

	@Post("create")
	async create(
		@Body() createProductDto: CreateProductDto,
		@Headers("Authorization") authorization: string
	): Promise<SuccessResponse | InvalidCredentialsResponse> {
		const token = await this.tokenServie.extractToken(authorization);
		return this.productsService.create(createProductDto, token);
	}

	@Post("create-bulk")
	async createBulk(
		@Body() createProductDto: CreateProductDto[],
		@Headers("Authorization") authorization: string
	): Promise<SuccessResponse | InvalidCredentialsResponse> {
		const token = await this.tokenServie.extractToken(authorization);
		return this.productsService.createBUlk(createProductDto, token);
	}

	@Post("bulk-create/:businessId")
	async createBusinessBulk(
		@Body() createProductDto: CreateProductDto[],
		@Headers("Authorization") authorization: string,
		@Param("businessId") businessId: string
	): Promise<SuccessResponse | InvalidCredentialsResponse> {
		const token = await this.tokenServie.extractToken(authorization);
		return this.productsService.createBulkByBusinessId(
			createProductDto,
			token,
			businessId
		);
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
