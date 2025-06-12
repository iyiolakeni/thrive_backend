"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
const nest_winston_1 = require("nest-winston");
dotenv.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    const logger = new common_1.Logger("Bootstrap");
    logger.log("Application is starting...");
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors({ origin: "*" });
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Thrive API")
        .setDescription("The endpoint for an eccomerce system")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("thrive", app, document);
    const port = process.env.PORT || 5000;
    logger.log(`Application is running on: http://localhost:${port}`);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map