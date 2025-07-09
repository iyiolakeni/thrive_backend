import { Injectable, Logger } from "@nestjs/common";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Purchase } from "./entities/purchase.entity";
import { Repository } from "typeorm";
import { SharedService } from "src/shared-service/shared-service.service";
import { PurchaseDto } from "./dto/purchase.dto";
import {
	DataResponse,
	ErrorResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SuccessResponse,
} from "src/models/response.dto";
import { WithdrawalDto } from "./dto/withdrawal.dto";
import { WithdrawalHistory } from "./entities/withdrawa_history.entity";
import { TokenService } from "src/shared-service/toekn-service.service";

@Injectable()
export class PurchaseService {
	private readonly logger = new Logger(PurchaseService.name);
	constructor(
		@InjectRepository(Purchase)
		private purchaseRepo: Repository<Purchase>,
		@InjectRepository(WithdrawalHistory)
		private withdrawalRepo: Repository<WithdrawalHistory>,
		private sharedService: SharedService,
		private sharedService2: TokenService
	) {}

	async create(
		userId: string,
		createPurchaseDto: PurchaseDto[]
	): Promise<
		DataResponse<
			| Purchase[]
			| NotFoundResponse
			| SuccessResponse
			| InvalidCredentialsResponse
		>
	> {
		console.log("UserId: ", userId);
		return this.sharedService.purchaseProduct(
			userId,
			createPurchaseDto
		) as Promise<
			DataResponse<
				| Purchase[]
				| NotFoundResponse
				| SuccessResponse
				| InvalidCredentialsResponse
			>
		>;
	}

	findAll() {
		return `This action returns all purchase`;
	}

	async withdrawal(businessId: string) {
		if (!businessId) {
			return new InvalidCredentialsResponse(
				"Business ID is required",
				"Required Field",
				400
			);
		}

		const business = await this.sharedService.findBusinessById(businessId);
		if (!business || business instanceof NotFoundResponse) {
			return new NotFoundResponse("Business not found", "Business Not Found");
		}

		const findPurchases = await this.purchaseRepo.find({
			where: { business: { id: businessId }, isPaidToBusiness: false },
		});

		if (!findPurchases || findPurchases.length === 0) {
			return new NotFoundResponse(
				"No purchases found for this business",
				"Purchases Not Found"
			);
		}

		let totalAmount = 0;

		for (const purchase of findPurchases) {
			totalAmount += Number(purchase.price); // or Number(purchase.price)
		}

		totalAmount = parseFloat(totalAmount.toFixed(2));

		this.logger.log(
			`Total amount to withdraw for business ${businessId}: ${totalAmount}`
		);

		const withdrawalDto: WithdrawalDto = {
			source: "balance",
			reason: "Withdrawal for business purchases",
			amount: totalAmount * 100, // Convert to smallest currency unit (e.g., cents)
			receipient: business.data.code,
		};

		const withdrawalHistory = this.withdrawalRepo.create({
			amount: Number(totalAmount) * 100,
			withdrawnBy: business.data.id,
			status: "pending",
		});

		const withdrawalResponse = await this.sharedService2.withdrawal(
			withdrawalDto
		);

		if (withdrawalResponse instanceof InvalidCredentialsResponse) {
			withdrawalHistory.status = "failed";
			await this.withdrawalRepo.save(withdrawalHistory);
			return withdrawalResponse;
		}

		if (withdrawalResponse instanceof DataResponse) {
			withdrawalHistory.status = "completed";
			withdrawalHistory.withdrawnAt = new Date();
			await this.withdrawalRepo.save(withdrawalHistory);

			// Update purchases to mark them as paid to business
			await this.purchaseRepo.update(
				{ business: { id: businessId }, isPaidToBusiness: false },
				{ isPaidToBusiness: true, payoutDate: new Date() }
			);

			return new DataResponse(withdrawalResponse.data, "Withdrawal successful");
		}
	}

	async withdrawalHistory(
		businessId: string
	): Promise<
		| DataResponse<WithdrawalHistory[]>
		| ErrorResponse
		| NotFoundResponse
		| InvalidCredentialsResponse
	> {
		if (!businessId) {
			return new InvalidCredentialsResponse(
				"Business ID is required",
				"Required Field",
				400
			);
		}

		try {
			const business = await this.sharedService.findBusinessById(businessId);
			if (!business || business instanceof NotFoundResponse) {
				return new NotFoundResponse("Business not found", "Business Not Found");
			}

			const withdrawalHistories = await this.withdrawalRepo.find({
				where: { withdrawnBy: business.data.id },
				order: { withdrawnAt: "DESC" },
			});

			if (!withdrawalHistories || withdrawalHistories.length === 0) {
				return new NotFoundResponse(
					"No withdrawal history found for this business",
					"Withdrawal History Not Found"
				);
			}

			return new DataResponse(
				withdrawalHistories,
				"Withdrawal history retrieved successfully"
			);
		} catch (error) {
			return new ErrorResponse(
				error.message || "An error occurred",
				"Business Not Found",
				500
			);
		}
	}

	findOne(id: number) {
		return `This action returns a #${id} purchase`;
	}

	update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
		return `This action updates a #${id} purchase`;
	}

	remove(id: number) {
		return `This action removes a #${id} purchase`;
	}
}
