import { Module } from "@nestjs/common";
import { ProductCategoriesService } from "./product-categories.service";
import { ProductCategoriesController } from "./product-categories.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductCategory } from "./entities/product-category";

@Module({
	imports: [TypeOrmModule.forFeature([ProductCategory])],
	controllers: [ProductCategoriesController],
	providers: [ProductCategoriesService],
	exports: [],
})
export class ProductCategoriesModule {}
