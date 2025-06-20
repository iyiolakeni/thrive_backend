import { Injectable } from "@nestjs/common";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Purchase } from "./entities/purchase.entity";
import { Repository } from "typeorm";
import { SharedService } from "src/shared-service/shared-service.service";
import { PurchaseDto } from "./dto/purchase.dto";
import {
	DataResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SuccessResponse,
} from "src/models/response.dto";

@Injectable()
export class PurchaseService {
	constructor(
		@InjectRepository(Purchase)
		private purchaseRepo: Repository<Purchase>,
		private sharedService: SharedService
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
