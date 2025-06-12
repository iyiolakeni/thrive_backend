import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { User } from "src/entities/user.entity/user.entity";
import { LoginDto } from "src/user/dto/login.dto";
import {
	DataResponse,
	InvalidCredentialsResponse,
	LoginResponse,
	NotFoundResponse,
} from "src/models/response.dto";
import { UserResponse } from "src/models/userResponse.dto";
import { ConfigService } from "@nestjs/config";
import { SharedService } from "src/shared-service/shared-service.service";
import { InjectRepository } from "@nestjs/typeorm";
import { LoginDetails } from "src/entities/login.entity/logindetails.entity";
import { Repository } from "typeorm";
import { LoginDetailsDto } from "src/user/dto/logindetails.dto";

@Injectable()
export class AuthService {
	constructor(
		private sharedService: SharedService,
		private jwtService: JwtService,
		private configService: ConfigService,
		@InjectRepository(LoginDetails)
		private loginDetailsRepo: Repository<LoginDetails>
	) {}

	async validateUser(
		email: string,
		password: string
	): Promise<
		DataResponse<UserResponse> | InvalidCredentialsResponse | NotFoundResponse
	> {
		const user = await this.sharedService.findOneByEmail(email);

		if (user instanceof NotFoundResponse) {
			return new NotFoundResponse("User not found");
		}

		const foundUser = user instanceof DataResponse ? user.data : null;
		if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
			const { password, ...result } = foundUser;
			return new DataResponse<UserResponse>(result, "User found");
		} else {
			return new InvalidCredentialsResponse(
				"Invalid credentials",
				"Unauthorized",
				foundUser.id
			);
		}
	}

	async login(
		loginDto: LoginDto,
		meta: {
			ipAddress: string;
			userAgent: string;
			deviceInfo: string;
			location: string;
		}
	): Promise<LoginResponse | InvalidCredentialsResponse | NotFoundResponse> {
		const response = await this.validateUser(loginDto.email, loginDto.password);

		console.log("Login response:", response);

		if (response instanceof InvalidCredentialsResponse) {
			await this.saveLoginDetails(response.userId, meta, response);
			throw new InvalidCredentialsResponse(
				"Invalid credentials",
				"Unauthorized",
				""
			);
		}
		if (response instanceof NotFoundResponse) {
			throw new NotFoundResponse("User not found");
		}

		const user = response.data;

		const payload = {
			email: user.email,
			sub: user.id,
		};
		await this.saveLoginDetails(user.id, meta, response);

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: "15m",
			secret: this.configService.get<string>("JWT_SECRET"),
		});

		// ✅ Now populate the login history details

		return new LoginResponse(accessToken, "Login successful");
	}

	saveLoginDetails(
		userId: string,
		meta: {
			ipAddress: string;
			userAgent: string;
			deviceInfo: string;
			location: string;
		},
		response: { statusCode: number; message?: string }
	): Promise<LoginDetails> {
		const loginDetails = new LoginDetailsDto();
		loginDetails.userId = userId;
		loginDetails.ipAddress = meta.ipAddress;
		loginDetails.userAgent = meta.userAgent;
		loginDetails.deviceInfo = meta.deviceInfo;
		loginDetails.loginSuccess = response.statusCode === 200 ? true : false; // Assuming statusCode 200 means success
		console.log("Login details:", meta.location);
		const loginDetailsEntity = this.loginDetailsRepo.create(loginDetails);
		return this.loginDetailsRepo.save(loginDetailsEntity);
	}
}
