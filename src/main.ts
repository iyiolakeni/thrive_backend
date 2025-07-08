import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import { Logger, ValidationPipe } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import "tsconfig-paths/register";

dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

	const logger = new Logger("Bootstrap");
	logger.log("Application is starting...");

	app.useGlobalPipes(new ValidationPipe());
	app.enableCors({ origin: "*" });

	const config = new DocumentBuilder()
		.setTitle("Thrive API")
		.setDescription("The endpoint for an eccomerce system")
		.setVersion("1.0")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
				in: "header",
			},
			"access-token"
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("thrive", app, document);

	const port = process.env.PORT || 5000;
	logger.log(`Application is running on: http://localhost:${port}`);
	await app.listen(port);
}
bootstrap();
