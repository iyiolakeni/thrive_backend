import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity/user.entity";
import { SharedService } from "./shared-service.service";
import { Business } from "src/entities/business.entity/business.entity";
import { ProductCategory } from "src/product-categories/entities/product-category";
import { Product } from "src/products/entities/products.entity";
import { Purchase } from "src/purchase/entities/purchase.entity";
import { TransactionDetail } from "src/transaction-details/entities/transaction-detail.entity";

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			Business,
			ProductCategory,
			Product,
			Purchase,
			TransactionDetail,
		]),
	],
	providers: [SharedService],
	exports: [
		SharedService,
		TypeOrmModule.forFeature([
			User,
			Business,
			ProductCategory,
			Product,
			Purchase,
			TransactionDetail,
		]),
	],
})
export class SharedServiceModule {}
