import { Module } from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { PurchaseController } from "./purchase.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Purchase } from "./entities/purchase.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Purchase])],
	controllers: [PurchaseController],
	providers: [PurchaseService],
})
export class PurchaseModule {}
