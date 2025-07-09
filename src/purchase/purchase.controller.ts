import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import { PurchaseDto } from "./dto/purchase.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { SharedService } from "src/shared-service/shared-service.service";

@Controller("purchase")
@ApiTags("Purchase")
export class PurchaseController {
	constructor(
		private readonly purchaseService: PurchaseService,
		private readonly sharedService: SharedService
	) {}

	@Post("buy/:userId")
	@ApiBody({ type: PurchaseDto, isArray: true })
	create(
		@Param("userId") userId: string,
		@Body() createPurchaseDto: PurchaseDto[]
	) {
		return this.purchaseService.create(userId, createPurchaseDto);
	}

	@Get()
	findAll() {
		return this.purchaseService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.purchaseService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updatePurchaseDto: UpdatePurchaseDto
	) {
		return this.purchaseService.update(+id, updatePurchaseDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.purchaseService.remove(+id);
	}
}
