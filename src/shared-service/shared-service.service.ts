import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { randomBytes } from "crypto";
import { Business } from "src/entities/business.entity/Business.entity";
import { User } from "src/entities/user.entity/User.entity";
import {
	DataResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SuccessResponse,
} from "src/models/response.dto";
import { UserResponse } from "src/models/userResponse.dto";
import { ProductCategory } from "src/product-categories/entities/ProductCategory";
import { Product } from "src/products/entities/product.entity";
import { PaymentDto } from "src/purchase/dto/payment.dto";
import { PurchaseDto } from "src/purchase/dto/purchase.dto";
import { Purchase } from "src/purchase/entities/purchase.entity";
import { TransactionDetail } from "src/transaction-details/entities/TransactionDetail.entity";
import { Repository } from "typeorm";

@Injectable()
export class SharedService {
	private readonly logger = new Logger(SharedService.name);
	private readonly paystackUrl = process.env.PAYSTACK_URL;
	private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

	constructor(
		@InjectRepository(User)
		private userRepo: Repository<User>,
		@InjectRepository(Business)
		private businessRepo: Repository<Business>,
		@InjectRepository(ProductCategory)
		private productCategoryRepo: Repository<ProductCategory>,
		@InjectRepository(Product)
		private productRepo: Repository<Product>,
		@InjectRepository(Purchase)
		private readonly purchaseRepo: Repository<Purchase>,
		@InjectRepository(TransactionDetail)
		private readonly transactionDetailRepo: Repository<TransactionDetail>
	) {}

	async findOneByEmail(
		email: string
	): Promise<DataResponse<User> | NotFoundResponse> {
		const user = await this.userRepo.findOneBy({ email });

		if (!user) {
			return new NotFoundResponse("User not found");
		}
		return new DataResponse<User>(user, "User found");
	}

	async findOneByUsername(
		username: string
	): Promise<DataResponse<UserResponse> | NotFoundResponse> {
		const user = await this.userRepo.findOneBy({ username });

		if (!user) {
			return new NotFoundResponse("User not found");
		}

		return new DataResponse<UserResponse>(user, "User Found");
	}

	async findBusinessById(
		id: string
	): Promise<DataResponse<Business> | NotFoundResponse> {
		const business = await this.businessRepo.findOneBy({ id });

		if (!business) {
			return new NotFoundResponse("Business not found");
		}

		return new DataResponse<Business>(business, "Business Found");
	}

	async findProductCategoryById(
		id: string
	): Promise<DataResponse<ProductCategory> | NotFoundResponse> {
		if (!id) {
			this.logger.error("Product Category ID is empty or undefined");
			return new NotFoundResponse("Product Category not found");
		}
		const productCategory = await this.productCategoryRepo.findOneBy({ id });

		if (!productCategory) {
			return new NotFoundResponse("Product Category not found");
		}

		return new DataResponse<ProductCategory>(
			productCategory,
			"Product Category Found"
		);
	}

	async purchaseProduct(
		userId: string,
		purchaseDto: PurchaseDto[]
	): Promise<
		| DataResponse<PurchaseDto>
		| NotFoundResponse
		| SuccessResponse
		| InvalidCredentialsResponse
	> {
		if (!purchaseDto || purchaseDto.length === 0) {
			this.logger.error("Purchase data is empty or undefined");
			return new InvalidCredentialsResponse(
				"Invalid purchase data",
				"Please provide valid purchase data",
				400
			);
		}

		let totalPrice = 0;
		this.logger.log("Total price initialized", totalPrice);
		this.logger.log("Purchase DTO", JSON.stringify(purchaseDto, null, 2));
		const paymentReference = this.generatePaymentReference();
		this.logger.log("Generated payment reference", paymentReference);
		const transactionDetail = this.transactionDetailRepo.create({
			paymentReference: paymentReference,
			paymentStatus: false,
			paymentMethod: "Online",
			totalPrice: totalPrice,
		});

		await this.transactionDetailRepo.save(transactionDetail);
		this.logger.log(
			"Transaction detail created",
			JSON.stringify(transactionDetail, null, 2)
		);

		//Check if User Exists
		const userResponse = await this.userRepo.findOneBy({ id: userId });
		this.logger.log("User response", userResponse);

		if (!userResponse) {
			this.logger.error("User not found for purchase", userId);
			return new NotFoundResponse(
				"User not found",
				"Please provide a valid user ID"
			);
		}
		this.logger.log("User found for purchase", userResponse.username);

		for (const purchase of purchaseDto) {
			this.logger.log("Processing purchase for product ID", purchase.productId);
			this.logger.log("Current Total Price", totalPrice);
			//Check if Product Exist
			this.logger.log("Checking product for purchase", purchase.productId);
			const productResponse = await this.productRepo.findOne({
				where: { id: purchase.productId },
			});

			this.logger.log(
				"Product response",
				JSON.stringify(productResponse, null, 2)
			);
			if (!productResponse || productResponse instanceof NotFoundResponse) {
				this.logger.error("Product not found for purchase", purchase.productId);
				return new NotFoundResponse(
					"Product not found with ID: " + purchase.productId,
					"Please provide a valid product ID"
				);
			}
			this.logger.log("Product found for purchase", productResponse.name);

			this.logger.log(
				`Processing purchase for user ${userResponse.username} of product ${productResponse.name} from business`
			);
			// Calculate total price (assuming productResponse has a price property)
			const productPrice = productResponse.price || 0;
			totalPrice += productPrice * purchase.quantity;

			this.logger.log(
				`Product price for ${productResponse.name} is ${productPrice}, quantity: ${purchase.quantity}`
			);

			this.logger.log(
				`Total price for product ${productResponse.name} is ${totalPrice}`
			);

			//Update Stock in Product Table
			const updateStock = await this.updateStock(
				productResponse.id,
				purchase.quantity
			);
			if (updateStock instanceof NotFoundResponse) {
				this.logger.error(
					"Failed to update stock for product",
					productResponse.name
				);
				return updateStock;
			}

			this.logger.log(
				`Stock updated successfully for product ${productResponse.name}`
			);

			// Create Purchase Record

			const purchaseRecord = this.purchaseRepo.create({
				quantity: purchase.quantity,
				product: productResponse,
				price: productPrice * purchase.quantity,
				paymentReference: paymentReference,
				transactionDetail: transactionDetail,
				user: userResponse,
			});
			try {
				await this.purchaseRepo.save(purchaseRecord);
				this.logger.log(
					`Purchase record created successfully for product ${productResponse.name}`
				);
			} catch (error) {
				this.logger.error("Failed to create purchase record", error);
				return new InvalidCredentialsResponse(
					"Failed to create purchase record",
					"Please try again later",
					500
				);
			}
		}
		// Make Transfer to Business and Save Purchase and transaction history
		this.logger.log("Total price calculated for all purchases", totalPrice);
		// transactionDetail.totalPrice = totalPrice;
		// transactionDetail.paymentStatus = true;

		this.logger.log(
			"Total price set in transaction detail",
			transactionDetail.totalPrice
		);

		this.logger.log(
			"Creating transaction detail",
			JSON.stringify(transactionDetail, null, 2)
		);

		const paymentDetail = new PaymentDto();
		paymentDetail.amount = totalPrice.toLocaleString("NGN"); // Paystack expects amount in kobo
		paymentDetail.email = userResponse.email;
		paymentDetail.reference = paymentReference;
		this.logger.log(`Payment detail created`, paymentDetail);
		let paymentResponse: DataResponse<any> | InvalidCredentialsResponse;
		try {
			paymentResponse = await this.initiatePayment(paymentDetail);
			this.logger.log("Payment response received", paymentResponse);

			if (paymentResponse instanceof InvalidCredentialsResponse) {
				this.logger.error("Payment initiation failed", paymentResponse.message);
				await this.transactionDetailRepo.update(transactionDetail.id, {
					...transactionDetail,
					totalPrice: totalPrice,
					paymentStatus: false,
					updatedAt: new Date(),
				});
				return paymentResponse;
			}
			await this.transactionDetailRepo.update(transactionDetail.id, {
				...transactionDetail,
				totalPrice: totalPrice,
				paymentStatus: true,
				updatedAt: new Date(),
			});
			this.logger.log(
				`Transaction detail created successfully with reference ${paymentReference}`
			);
		} catch (error) {
			this.logger.error("Failed to create transaction detail", error);
			return new InvalidCredentialsResponse(
				"Failed to create transaction detail",
				"Please try again later",
				500
			);
		}

		this.logger.log(
			`Transaction detail updated successfully with reference ${paymentReference}`
		);
		return new DataResponse<PurchaseDto>(
			paymentResponse.data,
			"Purchase completed successfully"
		);
	}

	async updateStock(
		id: string,
		quantity: number
	): Promise<SuccessResponse | NotFoundResponse> {
		this.logger.log(`Updating stock for id: ${id} with quantity: ${quantity}`);

		const product = await this.productRepo.findOneBy({ id });
		if (!product) {
			this.logger.error(`Product with id ${id} not found`);
			return new NotFoundResponse(
				"Product not found",
				"Please provide a valid product ID"
			);
		}

		this.logger.log(
			`Product found: ${product.name}, current stock: ${product.stock}`
		);
		product.stock -= quantity;
		this.logger.log(`Updated stock: ${product.stock}`);
		await this.productRepo.update(id, { stock: product.stock });
		this.logger.log(`Stock updated successfully for product: ${product.name}`);
		return new SuccessResponse("Stock updated successfully", 200);
	}

	generatePaymentReference(): string {
		const randomString = randomBytes(5).toString("hex").toUpperCase();
		this.logger.log(
			"Generated random string for payment reference",
			randomString
		);
		return `PAY-${randomString}`;
	}

	async initiatePayment(
		paymentDto: PaymentDto
	): Promise<
		DataResponse<any> | InvalidCredentialsResponse | NotFoundResponse
	> {
		this.logger.log("Initiating payment");
		const headers = {
			Authorization: `Bearer ${this.paystackSecretKey}`,
			"Content-Type": "application/json",
		};
		try {
			const response = await axios.post(
				`${this.paystackUrl}/transaction/initialize`,
				{
					email: paymentDto.email,
					amount: Math.round(parseFloat(paymentDto.amount) * 100),
					// Paystack expects amount in kobo
					reference: paymentDto.reference,
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
			this.logger.error("Error initiating payment", error);
			if (axios.isAxiosError(error)) {
				this.logger.error("Axios error occurred", error.message);
				return new InvalidCredentialsResponse(
					"Payment initiation failed",
					error.message,
					500
				);
			} else {
				this.logger.error("Unexpected error occurred", error);
				return new InvalidCredentialsResponse(
					"Payment initiation failed",
					"An unexpected error occurred",
					500
				);
			}
		}
	}
}
