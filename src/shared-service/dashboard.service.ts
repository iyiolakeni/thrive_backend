import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
	DataResponse,
	ErrorResponse,
	NotFoundResponse,
} from "src/models/response.dto";
import { ProductCategory } from "src/product-categories/entities/product-category";
import { Product } from "src/products/entities/products.entity";
import { Repository, MoreThan } from "typeorm";

@Injectable()
export class DashboardService {
	private readonly logger = new Logger(DashboardService.name);

	constructor(
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
		@InjectRepository(ProductCategory)
		private readonly productCategoryRepo: Repository<ProductCategory>
	) {}

	async bestSellingProduct(): Promise<
		DataResponse<Product[]> | NotFoundResponse | ErrorResponse
	> {
		try {
			const products = await this.productRepo.find({
				where: { rating: MoreThan(0) },
				order: { rating: "DESC" },
			});

			if (!products || products === null || products.length === 0) {
				return new NotFoundResponse(
					"No sponsored products found",
					"No sponsored products found"
				);
			}

			return new DataResponse(products);
		} catch (error) {
			this.logger.error("Error: ", error);
			return new ErrorResponse(
				"Error fetching best selling product",
				"Error fetching best selling product"
			);
		}
	}

	async sponsoredProduct(): Promise<
		DataResponse<Product[]> | ErrorResponse | NotFoundResponse
	> {
		try {
			const products = await this.productRepo.find({
				where: { discount: MoreThan(0) },
				order: { rating: "DESC" },
			});

			if (!products || products === null || products.length === 0) {
				return new NotFoundResponse(
					"No sponsored products found",
					"No sponsored products found"
				);
			}
			return new DataResponse(products);
		} catch (error) {
			this.logger.error("Error: ", error);
			return new ErrorResponse(error.message, "Error");
		}
	}

	async getProductCategory(): Promise<
		DataResponse<ProductCategory[]> | NotFoundResponse | ErrorResponse
	> {
		try {
			this.logger.log("Fetching all products");

			const products = await this.productCategoryRepo.find();
			if (!products || products.length === 0) {
				this.logger.warn("No products found");
				return new NotFoundResponse("No products found", "404 Not Found");
			}

			this.logger.log(`Found ${products.length} products`);
			return new DataResponse(products, "Products retrieved successfully", 200);
		} catch (error) {
			this.logger.error("Error: ", error);
			return new ErrorResponse(error.message, "Error");
		}
	}
}
