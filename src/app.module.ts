import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { BusinessModule } from "./business/business.module";
import { AuthModule } from "./auth/auth.module";
import { CatalogModule } from "./catalog/catalog.module";
import { LoggerModule } from "./logger/logger.module";
import { EmailModule } from "./email/email.module";
import { ProductCategoriesModule } from "./product-categories/product-categories.module";
import { ProductsModule } from "./products/products.module";
import { SharedServiceModule } from "./shared-service/shared-service.module";
import { PurchaseModule } from "./purchase/purchase.module";
import { TransactionDetailsModule } from "./transaction-details/transaction-details.module";

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
			connectTimeoutMS: 60000,
			autoLoadEntities: true,
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
