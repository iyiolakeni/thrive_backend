import { Module } from "@nestjs/common";
import { BusinessService } from "./business.service";
import { BusinessController } from "./business.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Business } from "src/entities/business.entity/Business.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Business])],
	providers: [BusinessService],
	controllers: [BusinessController],
})
export class BusinessModule {}
