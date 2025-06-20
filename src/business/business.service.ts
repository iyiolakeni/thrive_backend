import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Business } from "src/entities/business.entity/Business.entity";
import { Repository } from "typeorm";
import { CreateBusinessDto } from "./dto/create-business.dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/update-business.dto/update-business.dto";
import { SharedService } from "src/shared-service/shared-service.service";
import {
	DataResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SuccessResponse,
} from "src/models/response.dto";
import axios from "axios";

@Injectable()
export class BusinessService {
	private readonly logger = new Logger(BusinessService.name);
	private readonly paystackUrl = process.env.PAYSTACK_URL;
	private readonly headers = {
		Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
		"Content-Type": "application/json",
	};

	constructor(
		@InjectRepository(Business)
		private businessRepo: Repository<Business>,
		private sharedService: SharedService
	) {}

	async create(
		createBusinessDto: CreateBusinessDto
	): Promise<SuccessResponse | NotFoundResponse | InvalidCredentialsResponse> {
		if (!createBusinessDto) {
			this.logger.error("Invalid business data provided");
			return new InvalidCredentialsResponse(
				"Invalid business data provided",
				"Invalid Details",
				400
			);
		}

		const user = await this.sharedService.findOneByEmail(
			createBusinessDto.email
		);
		this.logger.log(
			`User fetched for email ${createBusinessDto.email}: ${JSON.stringify(
				user
			)}`
		);
		if (!user || "error" in user) {
			this.logger.error(`User with email ${createBusinessDto.email} not found`);
			throw new NotFoundResponse(
				`User with email ${createBusinessDto.email} not found`
			);
		}

		const foundUser = user instanceof DataResponse ? user.data : null;
		if (foundUser.userType !== "VENDOR") {
			this.logger.error(
				`User with email ${createBusinessDto.email} is not registered as a business`
			);
			return new InvalidCredentialsResponse(
				"User is not registered as a business",
				"Invalid Role",
				400
			);
		}

		const existingBusiness = await this.businessRepo.findOne({
			where: { businessName: createBusinessDto.businessName },
		});

		if (existingBusiness) {
			this.logger.error(
				`Business with name ${createBusinessDto.businessName} already exists`
			);
			throw new ConflictException(
				"Business Already Exist, try another user or reset password"
			);
		}

		this.logger.log("Validating bank account details");
		const validBankAccount = await this.verifyAccount(
			createBusinessDto.bankAccountNumber,
			createBusinessDto.bank_code
		);

		if (validBankAccount instanceof InvalidCredentialsResponse) {
			this.logger.error(
				`Invalid bank account details provided: ${validBankAccount.message}`
			);
			return validBankAccount;
		}

		this.logger.log("Creating sub-account for business");
		const createSubAccountResponse = await this.createSubAccount(
			createBusinessDto.businessName,
			createBusinessDto.bank_code,
			createBusinessDto.bankAccountNumber,
			createBusinessDto.email
		);
		if (createSubAccountResponse instanceof NotFoundResponse) {
			this.logger.error(
				`Failed to create sub-account: ${createSubAccountResponse.message}`
			);
			return createSubAccountResponse;
		}

		if (createSubAccountResponse instanceof InvalidCredentialsResponse) {
			this.logger.error(
				`Failed to create sub-account: ${createSubAccountResponse.message}`
			);
			return createSubAccountResponse;
		}
		this.logger.log(
			`Sub-account created successfully: ${JSON.stringify(
				createSubAccountResponse.data,
				null,
				2
			)}`
		);

		const business = this.businessRepo.create({
			...createBusinessDto,
			userId: foundUser.id,
			bankName: createSubAccountResponse.data.data.settlement_bank,
		});

		try {
			await this.businessRepo.save(business);
		} catch (error) {
			this.logger.error(
				`Error creating business: ${error.message}`,
				error.stack
			);
			throw new ConflictException("Error creating business");
		}

		return new SuccessResponse("Business created successfully", 200);
	}

	async getAllBusiness(): Promise<DataResponse<Business[]>> {
		const business = await this.businessRepo.find();

		return new DataResponse<Business[]>(
			business,
			"All Businesses fetched successfully",
			200
		);
	}

	async getBusiness(
		name: string
	): Promise<DataResponse<Business> | NotFoundResponse> {
		const business = await this.businessRepo.findOneBy({ businessName: name });

		if (!business) {
			return new NotFoundResponse(`Business with id ${name} not found`);
		}

		return new DataResponse<Business>(
			business,
			"Business fetched successfully",
			200
		);
	}

	async getAllBanks(): Promise<DataResponse<any> | NotFoundResponse> {
		this.logger.log("Fetching all banks from Paystack");
		this.logger.log("Using Paystack URL:", this.paystackUrl);

		try {
			const response = await axios.get(`${this.paystackUrl}/bank`, {
				headers: this.headers,
			});

			if (response.data.status) {
				this.logger.log("Banks fetched successfully from Paystack");
				this.logger.log(
					"Response data Length:",
					JSON.stringify(response.data.data.length)
				);
				return new DataResponse(
					response.data.data,
					"All Banks fetched successfully",
					200
				);
			} else {
				this.logger.error("Failed to fetch banks from Paystack");
				return new NotFoundResponse("Failed to fetch banks from Paystack");
			}
		} catch (error) {
			this.logger.error(`Error fetching banks: ${error.message}`);
			return new NotFoundResponse(`Error fetching banks: ${error.message}`);
		}
	}

	async updateBusiness(
		name: string,
		updateBusinessdto: UpdateBusinessDto
	): Promise<Business> {
		const business = await this.businessRepo.findOne({
			where: { businessName: name },
		});
		if (!business) {
			throw new NotFoundException(`Business with name ${name} not found`);
		}
		Object.assign(business, updateBusinessdto);
		return this.businessRepo.save(business);
	}

	async deleteBusiness(businessName: string): Promise<void> {
		await this.businessRepo.delete(businessName);
	}

	async verifyBusiness(
		id: string
	): Promise<SuccessResponse | NotFoundResponse> {
		const business = await this.businessRepo.findOne({ where: { id } });

		if (!business) {
			return new NotFoundResponse(`Business with id ${id} not found`);
		}

		business.isVerified = true;
		business.verificationDate = new Date();

		await this.businessRepo.save(business);
		return new SuccessResponse("Business verified successfully", 200);
	}

	async activateBusiness(
		id: string
	): Promise<SuccessResponse | NotFoundResponse> {
		const business = await this.businessRepo.findOne({ where: { id } });

		if (!business) {
			return new NotFoundResponse(`Business with id ${id} not found`);
		}

		business.isActive = false;
		business.modificationDate = null;

		await this.businessRepo.save(business);
		return new SuccessResponse("Business deactivated successfully", 200);
	}

	async deactivateBusiness(
		id: string
	): Promise<SuccessResponse | NotFoundResponse> {
		const business = await this.businessRepo.findOne({ where: { id } });

		if (!business) {
			return new NotFoundResponse(`Business with id ${id} not found`);
		}

		business.isActive = false;
		business.modificationDate = null;

		await this.businessRepo.save(business);
		return new SuccessResponse("Business deactivated successfully", 200);
	}

	async verifyAccount(
		accountNumber: string,
		bankCode: string
	): Promise<DataResponse<any> | NotFoundResponse> {
		this.logger.log(
			`Verifying account with number ${accountNumber} and bank code ${bankCode}`
		);

		if (!accountNumber || !bankCode) {
			this.logger.error(
				"Account number and bank code are required for verification"
			);
			return new NotFoundResponse("Account number and bank code are required");
		}

		const url = `${this.paystackUrl}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
		try {
			const response = await axios.get(url, { headers: this.headers });
			this.logger.log(`Account verification response: ${response.data}`);

			if (response.data.status) {
				return new DataResponse(
					response.data,
					"Account verified successfully",
					200
				);
			} else {
				return new NotFoundResponse("Account verification failed");
			}
		} catch (error) {
			this.logger.error(`${error}`);
			this.logger.error(`Error verifying account: ${error.message}`);
			if (axios.isAxiosError(error)) {
				this.logger.error("Axios error occurred", error.message);
				return new InvalidCredentialsResponse(
					"Unabale to Verify User Account",
					error.message,
					500
				);
			} else {
				this.logger.error("Unexpected error occurred", error);
				return new InvalidCredentialsResponse(
					"Account Number Verification Failed failed",
					"An unexpected error occurred",
					500
				);
			}
		}
	}

	async createSubAccount(
		business_name: string,
		bank_code: string,
		account_number: string,
		primary_contact_email: string
	): Promise<
		DataResponse<any> | InvalidCredentialsResponse | NotFoundResponse
	> {
		this.logger.log(
			`Creating sub-account for business ${business_name} with bank code ${bank_code} and account number ${account_number}`
		);

		if (!business_name || !bank_code || !account_number) {
			this.logger.error(
				"Business name, bank code, and account number are required"
			);
			return new NotFoundResponse(
				"Business name, bank code, and account number are required"
			);
		}

		const url = `${this.paystackUrl}/subaccount`;
		const data = {
			business_name,
			bank_code,
			account_number,
			primary_contact_email,
			percentage_charge: 15,
		};

		try {
			const response = await axios.post(url, data, { headers: this.headers });
			this.logger.log(`Sub-account creation response: ${response.data}`);

			if (response.data.status) {
				this.logger.log(
					`Sub-account for business ${business_name} created successfully`
				);
				return new DataResponse(
					response.data,
					"Sub-account created successfully",
					200
				);
			} else {
				return new InvalidCredentialsResponse(
					"Sub-account creation failed",
					"Unable to Create",
					400
				);
			}
		} catch (error) {
			this.logger.error(`Error creating sub-account: ${error.message}`);
			return new NotFoundResponse(
				`Error creating sub-account: ${error.message}`
			);
		}
	}
}
