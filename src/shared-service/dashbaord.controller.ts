import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@ApiTags("Dashboard")
export class DashboardController {
	constructor(private dashboardService: DashboardService) {}

	@Get("best-sellers")
	bestSellingProduct() {
		return this.dashboardService.bestSellingProduct();
	}

	@Get("sponsored-product")
	sponsoredProduct() {
		return this.dashboardService.sponsoredProduct();
	}

	@Get("product-category")
	getProductCategory() {
		return this.dashboardService.getProductCategory();
	}
}
