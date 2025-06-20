import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity/User.entity";
import { SharedService } from "./shared-service.service";
import { Business } from "src/entities/business.entity/Business.entity";
import { ProductCategory } from "src/product-categories/entities/ProductCategory";
import { Product } from "src/products/entities/Product.entity";
import { Purchase } from "src/purchase/entities/purchase.entity";
import { TransactionDetail } from "src/transaction-details/entities/TransactionDetail.entity";

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
