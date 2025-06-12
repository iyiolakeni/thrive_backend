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
import { NotFoundResponse, SuccessResponse } from "src/models/response.dto";
import { EmailDto } from "src/email/dto/email.dto";
import { ResetPasswordDto } from "./dto/reset_password.dto";

@Controller("User")
@ApiTags("User Details")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(@Body() createUserdto: CreateUserDto): Promise<User> {
		try {
			return this.userService.create(createUserdto);
		} catch (error) {
			if (error instanceof ConflictException) {
				throw new HttpException("Username already exists", HttpStatus.CONFLICT);
			}
			throw error;
		}
	}

	@Get()
	getAllusers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@UseGuards(JwtAwthGuard)
	@ApiBearerAuth()
	@Get(":username")
	async getUser(@Param("username") username: string): Promise<User> {
		return this.userService.getUser(username);
	}

	@Patch(":username")
	@UseGuards(JwtAwthGuard)
	@ApiBearerAuth()
	// @UseGuards(LocalAuthGuard)
	async updateUser(
		@Param("username") username: string,
		@Body() updateUserDto: UpdateUserDto
	): Promise<User> {
		return this.userService.updateUser(username, updateUserDto);
	}

	@Delete(":username")
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
}
