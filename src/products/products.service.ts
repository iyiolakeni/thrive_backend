import { Injectable, Logger } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/products.entity";
import { Repository } from "typeorm";
import { SharedService } from "src/shared-service/shared-service.service";
import {
	ConflictResponse,
	DataResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SuccessResponse,
} from "src/models/response.dto";

@Injectable()
export class ProductsService {
	private readonly logger = new Logger(ProductsService.name);

	constructor(
		@InjectRepository(Product)
		private productRepo: Repository<Product>,
		private shareService: SharedService
	) {}

	async create(
		createProductDto: CreateProductDto
	): Promise<SuccessResponse | InvalidCredentialsResponse> {
		this.logger.log("Creating a new product", createProductDto.name);

		// Check if product name already exists
		const existingProduct = await this.productRepo.findOneBy({
			name: createProductDto.name,
		});

		this.logger.warn(
			"Exisiting Business",
			JSON.stringify(existingProduct, null, 2)
		);
		// this.logger.warn("Exisiting Business", existingProduct.businessId);

		if (
			existingProduct !== null &&
			existingProduct.businessId === createProductDto.businessId
		) {
			this.logger.error(
				"Product with this name already exists under the business"
			);
			return new ConflictResponse(
				"Product with this name already exists",
				"Product exists"
			);
		}
		// Validate the business ID
		const businessResponse = await this.shareService.findBusinessById(
			createProductDto.businessId
		);
		const foundBusiness =
			businessResponse instanceof DataResponse ? businessResponse.data : null;
		this.logger.log("Business found", foundBusiness);

		if (!foundBusiness) {
			this.logger.error("Business not found");
			return new InvalidCredentialsResponse("Business not found", "", 404);
		}

		const productCategoryResponse =
			await this.shareService.findProductCategoryById(
				createProductDto.categoryId
			);
		const foundProductCategory =
			productCategoryResponse instanceof DataResponse
				? productCategoryResponse.data
				: null;

		if (!foundProductCategory) {
			this.logger.error("Product category not found");
			return new InvalidCredentialsResponse(
				"Product category not found",
				"",
				404
			);
		}

		this.logger.log("Product category found", foundProductCategory);

		const product = this.productRepo.create({
			...createProductDto,
			price:
				createProductDto.unitPrice -
				createProductDto.unitPrice * (createProductDto.discount / 100), // Assuming unitPrice is the price
		});
		this.logger.log("Product created", JSON.stringify(product, null, 2));
		await this.productRepo.save(product);

		this.logger.log("Product created successfully", product.name);

		return new SuccessResponse("Product created successfully", 200);
	}

	async findAll(): Promise<DataResponse<Product[]> | NotFoundResponse> {
		this.logger.log("Fetching all products");

		const products = await this.productRepo.find();
		if (!products || products.length === 0) {
			this.logger.warn("No products found");
			return new NotFoundResponse("No products found", "404 Not Found");
		}

		this.logger.log(`Found ${products.length} products`);
		return new DataResponse(products, "Products retrieved successfully", 200);
	}

	async findOne(id: string): Promise<DataResponse<Product> | NotFoundResponse> {
		this.logger.log(`Fetching product with ID: ${id}`);
		const product = await this.productRepo.findOneBy({ id });

		if (!product) {
			this.logger.warn(`Product with ID ${id} not found`);
			return new NotFoundResponse("Product not found", "Not Found");
		}

		this.logger.log(`Product found: ${product.name}`);
		return new DataResponse(product, "Product retrieved successfully", 200);
	}

	async update(
		id: string,
		updateProductDto: UpdateProductDto
	): Promise<SuccessResponse | NotFoundResponse> {
		this.logger.log(`Updating product with ID: ${id}`, updateProductDto);
		const product = await this.productRepo.findOneBy({ id });
		if (!product) {
			this.logger.warn(`Product with ID ${id} not found`);
			return new NotFoundResponse("Product not found", "Not Found");
		}

		this.logger.log(`Product found: ${product.name}, updating...`);
		await this.productRepo.update(id, updateProductDto);
		this.logger.log(`Product with ID ${id} updated successfully`);

		return new SuccessResponse("Product updated successfully", 200);
	}

	async remove(id: string): Promise<SuccessResponse | NotFoundResponse> {
		this.logger.log(`Deleting product with ID: ${id}`);
		const product = await this.productRepo.findOneBy({ id });

		if (!product) {
			this.logger.warn(`Product with ID ${id} not found`);
			return new NotFoundResponse("Product not found", "Not Found");
		}

		this.logger.log(`Product found: ${product.name}, deleting...`);
		await this.productRepo.delete(id);
		this.logger.log(`Product with ID ${id} deleted successfully`);

		return new SuccessResponse("Product deleted successfully", 200);
	}

	async reStockProduct(
		id: string,
		stokc: number
	): Promise<SuccessResponse | NotFoundResponse> {
		this.logger.log(`Restocking product with ID: ${id}, stock: ${stokc}`);
		const product = await this.productRepo.findOneBy({ id });

		if (!product) {
			this.logger.warn(`Product with ID ${id} not found`);
			return new NotFoundResponse("Product not found", "Not Found");
		}

		product.stock += stokc;
		if (product.isAvailable === false) {
			product.isAvailable = true;
		}
		this.logger.log(
			`Restocking product: ${product.name}, new stock: ${product.stock}`
		);
		await this.productRepo.save(product);
		this.logger.log(`Product with ID ${id} restocked successfully`);

		return new SuccessResponse("Product restocked successfully", 200);
	}
}
