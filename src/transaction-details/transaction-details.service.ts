import { Injectable, Logger } from "@nestjs/common";
import { CreateTransactionDetailDto } from "./dto/create-transaction-detail.dto";
import { UpdateTransactionDetailDto } from "./dto/update-transaction-detail.dto";
import { DataResponse, NotFoundResponse } from "src/models/response.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import axios from "axios";
import { TransactionDetail } from "./entities/transaction-detail.entity";

@Injectable()
export class TransactionDetailsService {
	private readonly logger = new Logger(TransactionDetailsService.name);
	private readonly paystackUrl = process.env.PAYSTACK_URL;
	private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

	constructor(
		@InjectRepository(TransactionDetail)
		private readonly transactionRepo: Repository<TransactionDetail>
	) {}

	async verifyTransaction(
		reference: string
	): Promise<DataResponse<any> | NotFoundResponse> {
		this.logger.log(`Verifying transaction with reference: ${reference}`);

		if (!reference) {
			this.logger.error("Reference is required for transaction verification");
			return Promise.resolve(new NotFoundResponse("Reference is required"));
		}

		const foundTransaction = this.transactionRepo.findOne({
			where: { paymentReference: reference },
		});
		if (!foundTransaction) {
			this.logger.error(`Transaction with reference ${reference} not found`);
			return new NotFoundResponse(
				`Transaction with reference ${reference} not found`
			);
		}

		this.logger.log(
			`Transaction with reference ${reference} found, proceeding to verify`
		);

		const headers = {
			Authorization: `Bearer ${this.paystackSecretKey}`,
			"Content-Type": "application/json",
		};
		const url = `${this.paystackUrl}/transaction/verify/${reference}`;
		const response = await axios.get(url, { headers });
		this.logger.log(`Transaction verification response: ${response.data}`);

		if (response.data.status) {
			this.logger.log(
				`Transaction with reference ${reference} verified successfully`
			);
			return new DataResponse(response.data);
		} else {
			this.logger.error(
				`Transaction verification failed for reference ${reference}`
			);
			return new NotFoundResponse(
				`Transaction verification failed for reference ${reference}`
			);
		}
	}

	findAll() {
		return `This action returns all transactionDetails`;
	}

	findOne(id: number) {
		return `This action returns a #${id} transactionDetail`;
	}

	update(id: number, updateTransactionDetailDto: UpdateTransactionDetailDto) {
		return `This action updates a #${id} transactionDetail`;
	}

	remove(id: number) {
		return `This action removes a #${id} transactionDetail`;
	}
}
