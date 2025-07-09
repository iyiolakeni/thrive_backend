import { Injectable, Logger } from "@nestjs/common";
import {
	BadRequestResponse,
	DataResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
} from "src/models/response.dto";
import { WithdrawalDto } from "src/purchase/dto/withdrawal.dto";
import axios from "axios";

@Injectable()
export class TokenService {
	private readonly logger = new Logger(TokenService.name);
	private readonly paystackUrl = process.env.PAYSTACK_URL;
	private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

	async extractToken(authorization: string) {
		if (!authorization) {
			throw new BadRequestResponse("Authorization header is required");
		}

		if (!authorization.startsWith("Bearer ")) {
			throw new BadRequestResponse(
				"Invalid authorization header format. Expected: Bearer <token>"
			);
		}

		const token = authorization.replace("Bearer ", "").trim();
		if (!token) {
			throw new BadRequestResponse("Token is required");
		}

		return token;
	}

	async withdrawal(
		withdrawalDto: WithdrawalDto
	): Promise<
		DataResponse<any> | InvalidCredentialsResponse | NotFoundResponse
	> {
		this.logger.log("Initiating payment");
		this.logger.log("Withdrawal DTO", JSON.stringify(withdrawalDto, null, 2));
		const headers = {
			Authorization: `Bearer ${this.paystackSecretKey}`,
			"Content-Type": "application/json",
		};
		try {
			const response = await axios.post(
				`${this.paystackUrl}/transfer`,
				{
					source: withdrawalDto.source,
					amount: withdrawalDto.amount,
					reason: withdrawalDto.reason,
					recipient: withdrawalDto.receipient,
				},
				{ headers: headers }
			);
			this.logger.log("Payment response received", response?.data);
			this.logger.log("Payment response", response?.data);
			if (response.data.status) {
				this.logger.log("Payment initiated successfully", response.data);
				return new DataResponse(
					response.data,
					"Payment initiated successfully"
				);
			} else {
				this.logger.error("Payment initiation failed", response.data.message);
				return new InvalidCredentialsResponse(
					"Payment initiation failed",
					response.data.message,
					400
				);
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const paystackError = error.response.data;
				this.logger.error(
					"Paystack error",
					JSON.stringify(paystackError, null, 2)
				);
				return new InvalidCredentialsResponse(
					"Payment initiation failed",
					paystackError?.message || "Paystack rejected the request",
					400
				);
			}
			this.logger.error("Unexpected error during payment initiation", error);
			return new InvalidCredentialsResponse(
				"Payment initiation failed",
				"An unexpected error occurred",
				500
			);
		}
	}
}
