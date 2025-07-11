import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import {
	HealthCheck,
	HealthCheckService,
	TypeOrmHealthIndicator,
} from "@nestjs/terminus";

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private healthService: HealthCheckService,
		private db: TypeOrmHealthIndicator
	) {}

	@Get("health-check")
	@HealthCheck()
	healthCheck() {
		return this.healthService.check([
			async () => this.db.pingCheck("database", { timeout: 3000 }),
		]);
	}
}
