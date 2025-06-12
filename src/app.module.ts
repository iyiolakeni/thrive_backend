import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { User } from "./entities/user.entity/user.entity";
import { Business } from "./entities/business.entity/business.entity";
import { BusinessModule } from "./business/business.module";
import { AuthModule } from "./auth/auth.module";
import { CatalogModule } from "./catalog/catalog.module";
import { LoginDetails } from "./entities/login.entity/logindetails.entity";
import { LoggerModule } from "./logger/logger.module";
import { EmailModule } from "./email/email.module";
import { PasswordRest } from "./entities/user.entity/password.entity";

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
			// url: process.env.POSTGRES_URL,
			entities: [User, LoginDetails, PasswordRest],
			synchronize: false,
		}),
		// TypeOrmModule.forFeature([User, LoginDetails]),
		UserModule,
		BusinessModule,
		AuthModule,
		CatalogModule,
		LoggerModule,
		EmailModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
