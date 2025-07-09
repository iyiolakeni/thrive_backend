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
	ErrorResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SuccessResponse,
	UnauthorizedResponse,
} from "src/models/response.dto";
import { CreateBusinessProductDto } from "./dto/create-product-business.dto";

@Injectable()
export class ProductsService {
	private readonly logger = new Logger(ProductsService.name);

	constructor(
		@InjectRepository(Product)
		private productRepo: Repository<Product>,
		private shareService: SharedService
	) {}

	async create(
		createProductDto: CreateProductDto,
		accessToken: string
	): Promise<SuccessResponse | InvalidCredentialsResponse | ErrorResponse> {
		try {
			const decodedToken = await this.shareService.decodeToken(accessToken);
			if (decodedToken instanceof UnauthorizedResponse) {
				return new ErrorResponse(
					"Invalid access token",
					"Authentication Error",
					401
				);
			}

			const userIsAdmin = await this.shareService.verifyUserIsAdmin(
				decodedToken.data.username
			);

			if (!userIsAdmin) {
				return new UnauthorizedResponse(
					"Only admins can create product categories",
					"Authorization Error"
				);
			}
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
				createdBy: decodedToken.data.username,
			});
			this.logger.log("Product created", JSON.stringify(product, null, 2));
			await this.productRepo.save(product);

			this.logger.log("Product created successfully", product.name);

			return new SuccessResponse("Product created successfully", 200);
		} catch (error) {
			this.logger.error("Error creating product", error);
			return new ErrorResponse(
				"An error occurred while creating the product",
				"Product Creation Error",
				500
			);
		}
	}

	async createBUlk(
		createProductDtos: CreateProductDto[],
		accessToken: string
	): Promise<SuccessResponse | InvalidCredentialsResponse | ErrorResponse> {
		const results: Product[] = [];
		const errors: string[] = [];

		try {
			const decodedToken = await this.shareService.decodeToken(accessToken);
			if (decodedToken instanceof UnauthorizedResponse) {
				return new ErrorResponse(
					"Invalid access token",
					"Authentication Error",
					401
				);
			}

			const userIsAdmin = await this.shareService.verifyUserIsAdmin(
				decodedToken.data.username
			);

			if (!userIsAdmin) {
				return new UnauthorizedResponse(
					"Only admins can create product categories",
					"Authorization Error"
				);
			}

			this.logger.log(
				`Starting bulk creation of ${createProductDtos.length} products`
			);

			for (let i = 0; i < createProductDtos.length; i++) {
				const createProductDto = createProductDtos[i];
				try {
					this.logger.log(
						`Creating product ${i + 1}/${createProductDtos.length}: ${
							createProductDto.name
						}`
					);

					// Check if product name already exists
					const existingProduct = await this.productRepo.findOneBy({
						name: createProductDto.name,
					});

					if (
						existingProduct !== null &&
						existingProduct.businessId === createProductDto.businessId
					) {
						const errorMsg = `Product with name '${createProductDto.name}' already exists under the business`;
						this.logger.error(errorMsg);
						errors.push(errorMsg);
						continue;
					}

					// Validate the business ID
					const businessResponse = await this.shareService.findBusinessById(
						createProductDto.businessId
					);
					const foundBusiness =
						businessResponse instanceof DataResponse
							? businessResponse.data
							: null;

					if (!foundBusiness) {
						const errorMsg = `Business not found for product '${createProductDto.name}'`;
						this.logger.error(errorMsg);
						errors.push(errorMsg);
						continue;
					}

					// Validate product category
					const productCategoryResponse =
						await this.shareService.findProductCategoryById(
							createProductDto.categoryId
						);
					const foundProductCategory =
						productCategoryResponse instanceof DataResponse
							? productCategoryResponse.data
							: null;

					if (!foundProductCategory) {
						const errorMsg = `Product category not found for product '${createProductDto.name}'`;
						this.logger.error(errorMsg);
						errors.push(errorMsg);
						continue;
					}

					// Create and save the product
					const product = this.productRepo.create({
						...createProductDto,
						price:
							createProductDto.unitPrice -
							createProductDto.unitPrice * (createProductDto.discount / 100),
						createdBy: decodedToken.data.username,
					});

					const savedProduct = await this.productRepo.save(product);
					results.push(savedProduct);
					this.logger.log(
						`Product '${createProductDto.name}' created successfully`
					);
				} catch (productError) {
					const errorMsg = `Error creating product '${createProductDto.name}': ${productError.message}`;
					this.logger.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			// Return results based on success/failure counts
			if (results.length === 0) {
				return new ErrorResponse(
					`Failed to create all products. Errors: ${errors.join("; ")}`,
					"Bulk Creation Failed",
					400
				);
			} else if (errors.length === 0) {
				return new SuccessResponse(
					`Successfully created all ${results.length} products`,
					200
				);
			} else {
				return new SuccessResponse(
					`Partially successful: ${results.length} products created, ${
						errors.length
					} failed. Errors: ${errors.join("; ")}`,
					206 // Partial Content
				);
			}
		} catch (error) {
			this.logger.error("Error during bulk product creation", error);
			return new ErrorResponse(
				"An error occurred while creating products in bulk",
				"Bulk Product Creation Error",
				500
			);
		}
	}

	async createBulkByBusinessId(
		createProductDtos: CreateBusinessProductDto[],
		accessToken: string,
		businessId: string
	): Promise<SuccessResponse | InvalidCredentialsResponse | ErrorResponse> {
		const results: Product[] = [];
		const errors: string[] = [];

		try {
			const decodedToken = await this.shareService.decodeToken(accessToken);
			if (decodedToken instanceof UnauthorizedResponse) {
				return new ErrorResponse(
					"Invalid access token",
					"Authentication Error",
					401
				);
			}

			const user = await this.shareService.findOneByUsername(
				decodedToken.data.username
			);

			if (!user || user instanceof NotFoundResponse) {
				return new InvalidCredentialsResponse(
					"User not found",
					"Invalid Credentials",
					404
				);
			}

			const userIsAdmin = await this.shareService.verifyUserIsVendor(
				decodedToken.data.username
			);

			if (!userIsAdmin) {
				return new UnauthorizedResponse(
					"Only admins can create product categories",
					"Authorization Error"
				);
			}

			this.logger.log(
				`Starting bulk creation of ${createProductDtos.length} products`
			);

			// Validate the business ID
			const businessResponse = await this.shareService.findBusinessById(
				businessId
			);
			const foundBusiness =
				businessResponse instanceof DataResponse ? businessResponse.data : null;

			if (!foundBusiness) {
				const errorMsg = `Business not found for products`;
				this.logger.error(errorMsg);
				return new InvalidCredentialsResponse(
					"Business not found",
					"Not Found",
					404
				);
			}

			if (foundBusiness.userId !== user.data.id) {
				this.logger.error(
					`User ${user.data.username} does not own the business with ID ${businessId}`
				);
				return new UnauthorizedResponse(
					"User does not own the business",
					"Unauthorized"
				);
			}

			for (let i = 0; i < createProductDtos.length; i++) {
				const createProductDto = createProductDtos[i];
				try {
					this.logger.log(
						`Creating product ${i + 1}/${createProductDtos.length}: ${
							createProductDto.name
						}`
					);

					// Check if product name already exists
					const existingProduct = await this.productRepo.findOneBy({
						name: createProductDto.name,
					});

					if (
						existingProduct !== null &&
						existingProduct.businessId === businessId
					) {
						const errorMsg = `Product with name '${createProductDto.name}' already exists under the business`;
						this.logger.error(errorMsg);
						errors.push(errorMsg);
						continue;
					}

					// Validate product category
					const productCategoryResponse =
						await this.shareService.findProductCategoryById(
							createProductDto.categoryId
						);
					const foundProductCategory =
						productCategoryResponse instanceof DataResponse
							? productCategoryResponse.data
							: null;

					if (!foundProductCategory) {
						const errorMsg = `Product category not found for product '${createProductDto.name}'`;
						this.logger.error(errorMsg);
						errors.push(errorMsg);
						continue;
					}

					// Create and save the product
					const product = this.productRepo.create({
						...createProductDto,
						price:
							createProductDto.unitPrice -
							createProductDto.unitPrice * (createProductDto.discount / 100),
						createdBy: user.data.username,
						businessId: businessId,
					});

					const savedProduct = await this.productRepo.save(product);
					results.push(savedProduct);
					this.logger.log(
						`Product '${createProductDto.name}' created successfully`
					);
				} catch (productError) {
					const errorMsg = `Error creating product '${createProductDto.name}': ${productError.message}`;
					this.logger.error(errorMsg);
					errors.push(errorMsg);
				}
			}

			// Return results based on success/failure counts
			if (results.length === 0) {
				return new ErrorResponse(
					`Failed to create all products. Errors: ${errors.join("; ")}`,
					"Bulk Creation Failed",
					400
				);
			} else if (errors.length === 0) {
				return new SuccessResponse(
					`Successfully created all ${results.length} products`,
					200
				);
			} else {
				return new SuccessResponse(
					`Partially successful: ${results.length} products created, ${
						errors.length
					} failed. Errors: ${errors.join("; ")}`,
					206 // Partial Content
				);
			}
		} catch (error) {
			this.logger.error("Error during bulk product creation", error);
			return new ErrorResponse(
				"An error occurred while creating products in bulk",
				"Bulk Product Creation Error",
				500
			);
		}
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
