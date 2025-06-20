import { Module } from "@nestjs/common";
import { TransactionDetailsService } from "./transaction-details.service";
import { TransactionDetailsController } from "./transaction-details.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionDetail } from "./entities/TransactionDetail.entity";

@Module({
	imports: [TypeOrmModule.forFeature([TransactionDetail])],
	controllers: [TransactionDetailsController],
	providers: [TransactionDetailsService],
})
export class TransactionDetailsModule {}
