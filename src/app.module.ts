import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { User } from "./entities/user.entity/User.entity";
import { Business } from "./entities/business.entity/Business.entity";
import { BusinessModule } from "./business/business.module";
import { AuthModule } from "./auth/auth.module";
import { CatalogModule } from "./catalog/catalog.module";
import { LoginDetails } from "./entities/login.entity/LoginDetails.entity";
import { LoggerModule } from "./logger/logger.module";
import { EmailModule } from "./email/email.module";
import { PasswordRest } from "./entities/user.entity/PasswordRest.entity";
import { ProductCategoriesModule } from "./product-categories/product-categories.module";
import { ProductCategory } from "./product-categories/entities/ProductCategory";
import { ProductsModule } from "./products/products.module";
import { Product } from "./products/entities/Product.entity";
import { SharedServiceModule } from "./shared-service/shared-service.module";
import { PurchaseModule } from "./purchase/purchase.module";
import { TransactionDetailsModule } from "./transaction-details/transaction-details.module";
import { Purchase } from "./purchase/entities/purchase.entity";
import { TransactionDetail } from "./transaction-details/entities/TransactionDetail.entity";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		LoggerModule,
		TypeOrmModule.forRoot({
			type: "postgres",
			host: process.env.POSTGRES_HOST,
			port: 5432,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DATABASE,
			ssl: true,
			url: process.env.POSTGRES_URL,
			entities: [
				User,
				LoginDetails,
				PasswordRest,
				ProductCategory,
				Business,
				Product,
				Purchase,
				TransactionDetail,
			],
			// autoLoadEntities: true,
			synchronize: false,
		}),
		UserModule,
		BusinessModule,
		AuthModule,
		CatalogModule,
		LoggerModule,
		EmailModule,
		ProductCategoriesModule,
		ProductsModule,
		SharedServiceModule,
		PurchaseModule,
		TransactionDetailsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
