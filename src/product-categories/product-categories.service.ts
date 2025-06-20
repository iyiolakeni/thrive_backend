import { Injectable } from "@nestjs/common";
import { CreateProductCategoryDto } from "./dto/create-product-category.dto";
import { UpdateProductCategoryDto } from "./dto/update-product-category.dto";
import {
	DataResponse,
	ErrorResponse,
	InvalidCredentialsResponse,
	SearchResponse,
	SuccessResponse,
} from "src/models/response.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductCategory } from "./entities/product-category";
import { Repository } from "typeorm";
import { SearchFilterDto } from "./dto/search-filter.dto";

@Injectable()
export class ProductCategoriesService {
	constructor(
		@InjectRepository(ProductCategory)
		private readonly productCategoryRepo: Repository<ProductCategory>
	) {}

	async create(
		createProductCategoryDto: CreateProductCategoryDto
	): Promise<SuccessResponse | ErrorResponse | InvalidCredentialsResponse> {
		const productCategoryExists = await this.productCategoryRepo.findOne({
			where: {
				name: createProductCategoryDto.name,
			},
		});

		if (productCategoryExists) {
			return new InvalidCredentialsResponse(
				"Product category with this name already exists",
				"Product Category Creation Error",
				403
			);
		}

		const productCategory = this.productCategoryRepo.create(
			createProductCategoryDto
		);
		await this.productCategoryRepo.save(productCategory);

		if (!productCategory) {
			return new ErrorResponse(
				"Product category creation failed",
				"Product Category Creation Error",
				500
			);
		}

		return new SuccessResponse("Product category created successfully", 201);
	}

	async findAll(): Promise<DataResponse<ProductCategory[]> | ErrorResponse> {
		const productCategories = await this.productCategoryRepo.find();

		if (!productCategories || productCategories.length === 0) {
			return new ErrorResponse(
				"No product categories found",
				"Product Category Retrieval Error",
				404
			);
		}

		return new DataResponse(productCategories, "Product Categories", 200);
	}

	async findOne(
		id: string
	): Promise<DataResponse<ProductCategory> | ErrorResponse> {
		const productCategory = await this.productCategoryRepo.findOne({
			where: { id },
		});

		if (!productCategory) {
			return new ErrorResponse(
				"Product category not found",
				"Product Category Retrieval Error",
				404
			);
		}

		return new DataResponse(productCategory, "Product Category", 200);
	}

	async update(id: string, updateProductCategoryDto: UpdateProductCategoryDto) {
		const productCategory = await this.productCategoryRepo.findOne({
			where: { id },
		});

		if (!productCategory) {
			return new ErrorResponse(
				"Product category not found",
				"Product Category Update Error",
				404
			);
		}

		const savedUpdate = await this.productCategoryRepo.update(
			id,
			updateProductCategoryDto
		);

		if (!savedUpdate) {
			return new ErrorResponse(
				"Product category update failed",
				"Product Category Update Error",
				500
			);
		}

		const updatedProductCategory = await this.productCategoryRepo.findOne({
			where: { id },
		});

		return new DataResponse(
			updatedProductCategory,
			"Product Category Updated Successfully",
			200
		);
	}

	async remove(id: string): Promise<SuccessResponse | ErrorResponse> {
		const productCategory = await this.productCategoryRepo.findOne({
			where: { id },
		});

		if (!productCategory) {
			return new ErrorResponse(
				"Product category not found",
				"Product Category Deletion Error",
				404
			);
		}

		await this.productCategoryRepo.delete(id);

		const deletedProductCategory = await this.productCategoryRepo.findOne({
			where: { id },
		});

		if (deletedProductCategory) {
			return new ErrorResponse(
				"Product category deletion failed",
				"Product Category Deletion Error",
				500
			);
		}

		return new SuccessResponse("Product category deleted successfully", 200);
	}

	async activate(id: string): Promise<SuccessResponse | ErrorResponse> {
		const productCategory = await this.productCategoryRepo.findOne({
			where: { id },
		});

		if (!productCategory) {
			return new ErrorResponse(
				"Product category not found",
				"Product Category Activation Error",
				404
			);
		}

		productCategory.isActive = true;
		await this.productCategoryRepo.save(productCategory);

		return new SuccessResponse("Product category activated successfully", 200);
	}

	async deactivate(id: string): Promise<SuccessResponse | ErrorResponse> {
		const productCategory = await this.productCategoryRepo.findOne({
			where: { id },
		});

		if (!productCategory) {
			return new ErrorResponse(
				"Product category not found",
				"Product Category Deactivation Error",
				404
			);
		}

		productCategory.isActive = false;
		await this.productCategoryRepo.save(productCategory);

		return new SuccessResponse(
			"Product category deactivated successfully",
			200
		);
	}

	async search(
		searchFilter: SearchFilterDto
	): Promise<
		| SearchResponse<ProductCategory[]>
		| SearchResponse<ProductCategory>
		| ErrorResponse
	> {
		const { searchTerm, page, limit, sortBy, sortOrder } = searchFilter;
		const queryBuilder =
			this.productCategoryRepo.createQueryBuilder("productCategory");
		if (searchTerm) {
			queryBuilder.where("productCategory.name ILIKE :searchTerm", {
				searchTerm: `%${searchTerm}%`,
			});
		}
		if (page && limit) {
			queryBuilder.skip((page - 1) * limit).take(limit);
		}

		if (sortBy && sortOrder) {
			if (!["ASC", "DESC"].includes(sortOrder.toUpperCase())) {
				return new ErrorResponse(
					"Invalid sort order. Use 'ASC' or 'DESC'.",
					"Product Category Search Error",
					400
				);
			}

			if (!["searchTerm"].includes(sortBy)) {
				return new ErrorResponse(
					"Sorting requires a name.",
					"Invalid Sort Field",
					400
				);
			}

			queryBuilder.orderBy(
				`productCategory.${sortBy}`,
				sortOrder.toUpperCase() as "ASC" | "DESC"
			);
		}
		const [result, total] = await queryBuilder.getManyAndCount();

		if (result.length === 0) {
			return new ErrorResponse(
				"No product categories found matching the search criteria",
				"Product Category Search Error",
				404
			);
		}

		return new SearchResponse(
			result,
			{
				total,
				page: page || 1,
				limit: limit || 10,
				totalPages: Math.ceil(total / (limit || 10)),
			},
			"Product Categories Search Results",
			200
		);
	}
}
