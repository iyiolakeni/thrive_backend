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
	UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto/create-user.dto";
import { User } from "src/entities/user.entity/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto/update-user.dto";
import { JwtAwthGuard } from "src/auth/jwt-auth.guard";
import {
	ErrorResponse,
	NotFoundResponse,
	SearchResponse,
	SuccessResponse,
} from "src/models/response.dto";
import { EmailDto } from "src/email/dto/email.dto";
import { ResetPasswordDto } from "./dto/reset_password.dto";
import { UserResponse } from "src/models/userResponse.dto";
import { SearchFilterDto } from "src/product-categories/dto/search-filter.dto";

@Controller("User")
@ApiTags("User Details")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post("create")
	async create(
		@Body() createUserdto: CreateUserDto
	): Promise<User | ErrorResponse | SuccessResponse> {
		try {
			return this.userService.create(createUserdto);
		} catch (error) {
			if (error instanceof ConflictException) {
				throw new HttpException("Username already exists", HttpStatus.CONFLICT);
			}
			throw error;
		}
	}

	@Get("all")
	getAllusers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@UseGuards(JwtAwthGuard)
	@ApiBearerAuth()
	@Get("get-user/:username")
	async getUser(@Param("username") username: string): Promise<User> {
		return this.userService.getUser(username);
	}

	@Patch("update/:username")
	@UseGuards(JwtAwthGuard)
	@ApiBearerAuth()
	// @UseGuards(LocalAuthGuard)
	async updateUser(
		@Param("username") username: string,
		@Body() updateUserDto: UpdateUserDto
	): Promise<User> {
		return this.userService.updateUser(username, updateUserDto);
	}

	@Delete("delete/:username")
	@UseGuards(JwtAwthGuard)
	// @UseGuards(LocalAuthGuard)
	async deleteUser(@Param("username") username: string): Promise<void> {
		return this.userService.deleteUser(username);
	}

	@Post("forget-password")
	async resetPasword(
		@Body() email: EmailDto
	): Promise<SuccessResponse | NotFoundResponse> {
		return this.userService.forgetPassword(email.email);
	}

	@Post("reset-password")
	async resetPassword(
		@Body() resetDetails: ResetPasswordDto
	): Promise<SuccessResponse | NotFoundResponse> {
		return this.userService.resetPassword(resetDetails);
	}

	@Get("get-user/:id")
	async getUserById(
		@Param("id") id: string
	): Promise<UserResponse | NotFoundResponse> {
		return this.userService.getUserById(id);
	}

	@Post("search")
	async searchUser(
		@Body() searchFilter: SearchFilterDto
	): Promise<
		| SearchResponse<UserResponse>
		| SearchResponse<UserResponse[]>
		| NotFoundResponse
	> {
		return this.userService.search(searchFilter);
	}

	@Post("activate/:username")
	async activateUser(
		@Param("username") username: string
	): Promise<User | NotFoundResponse> {
		return this.userService.activateUser(username);
	}

	@Post("deactivate/:username")
	async deactivateUser(
		@Param("username") username: string
	): Promise<User | NotFoundResponse> {
		return this.userService.deactivateUser(username);
	}

	@Post("verify-email/:token")
	async verifyEmail(
		@Param("token") token: string
	): Promise<UserResponse | NotFoundResponse> {
		return this.userService.verifyUser(token);
	}
}
