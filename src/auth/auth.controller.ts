import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Request,
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { LoginDto } from "src/user/dto/login.dto";
// import { Request } from 'express';
import { RequestMeta } from "src/models/request-meta.decorator";

@Controller("auth")
@ApiTags("Login")
export class AuthController {
	constructor(private authService: AuthService) {}

	// @UseGuards(LocalAuthGuard)
	@Post("login")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "User Login" })
	@ApiResponse({ status: 200, description: "Login successful" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	async login(@Body() loginDto: LoginDto, @RequestMeta() meta) {
		return this.authService.login(loginDto, meta); // 👈 pass metadata here
	}
}
