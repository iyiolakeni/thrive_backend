import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { TransactionDetailsService } from "./transaction-details.service";
import { UpdateTransactionDetailDto } from "./dto/update-transaction-detail.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("transaction-details")
@ApiTags("Transaction Details")
export class TransactionDetailsController {
	constructor(
		private readonly transactionDetailsService: TransactionDetailsService
	) {}

	@Post("verify/:reference")
	verifyTransaction(@Param("reference") reference: string) {
		return this.transactionDetailsService.verifyTransaction(reference);
	}

	@Get()
	findAll() {
		return this.transactionDetailsService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.transactionDetailsService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateTransactionDetailDto: UpdateTransactionDetailDto
	) {
		return this.transactionDetailsService.update(
			+id,
			updateTransactionDetailDto
		);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.transactionDetailsService.remove(+id);
	}
}
