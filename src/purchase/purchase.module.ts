import { Module } from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { PurchaseController } from "./purchase.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Purchase } from "./entities/purchase.entity";
import { WithdrawalHistory } from "./entities/withdrawa_history.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Purchase, WithdrawalHistory])],
	controllers: [PurchaseController],
	providers: [PurchaseService],
})
export class PurchaseModule {}
