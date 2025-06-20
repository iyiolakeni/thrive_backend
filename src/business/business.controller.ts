import {
	Body,
	ConflictException,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BusinessService } from "./business.service";
import { CreateBusinessDto } from "./dto/create-business.dto/create-business.dto";
import { Business } from "src/entities/business.entity/business.entity";
import { UpdateBusinessDto } from "./dto/update-business.dto/update-business.dto";
import {
	DataResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SuccessResponse,
} from "src/models/response.dto";

@Controller("Business")
@ApiTags("Business Details")
export class BusinessController {
	constructor(private readonly businessService: BusinessService) {}

	@Post("create")
	async create(
		@Body() createbusinessDto: CreateBusinessDto
	): Promise<SuccessResponse | NotFoundResponse | InvalidCredentialsResponse> {
		try {
			return this.businessService.create(createbusinessDto);
		} catch (error) {
			if (error instanceof ConflictException) {
				throw new HttpException(
					"Business Already Exist, try another or reset details",
					HttpStatus.CONFLICT
				);
			}
			throw error;
		}
	}

	@Get("all")
	getAllBusiness(): Promise<DataResponse<Business[]>> {
		return this.businessService.getAllBusiness();
	}

	@Get(":businessName")
	async getBusinessDetails(
		@Param("businessName") businessName: string
	): Promise<DataResponse<Business> | NotFoundResponse> {
		return this.businessService.getBusiness(businessName);
	}

	@Patch(":businessName")
	async updateBusiness(
		@Param("businessName") businessName: string,
		@Body() updateBusinessDto: UpdateBusinessDto
	): Promise<Business> {
		return this.businessService.updateBusiness(businessName, updateBusinessDto);
	}

	@Delete(":businessName")
	async deleteBusiness(
		@Param("businessName") businessName: string
	): Promise<void> {
		return this.businessService.deleteBusiness(businessName);
	}

	@Patch("verify-business/:id")
	async verifyBusiness(
		@Param("id") id: string
	): Promise<SuccessResponse | NotFoundResponse> {
		return this.businessService.verifyBusiness(id);
	}

	@Patch("activate-business/:id")
	async activateBusiness(
		@Param("id") id: string
	): Promise<SuccessResponse | NotFoundResponse> {
		return this.businessService.activateBusiness(id);
	}

	@Patch("deactivate-business/:id")
	async deactivateBusiness(
		@Param("id") id: string
	): Promise<SuccessResponse | NotFoundResponse> {
		return this.businessService.deactivateBusiness(id);
	}

	@Post("banks")
	async getAllBanks(): Promise<DataResponse<any> | NotFoundResponse> {
		return this.businessService.getAllBanks();
	}
}
