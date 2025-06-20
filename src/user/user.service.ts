import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto/update-user.dto";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import {
	ConflictResponse,
	DataResponse,
	ErrorResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SearchResponse,
	SuccessResponse,
} from "src/models/response.dto";
import { Injectable, Logger } from "@nestjs/common";
import { PasswordRest } from "src/entities/user.entity/password-rest.entity";
import { EmailService } from "src/email/email.service";
import { ResetPasswordDto } from "./dto/reset_password.dto";
import { UserResponse } from "src/models/userResponse.dto";
import { SearchFilterDto } from "src/product-categories/dto/search-filter.dto";
import { UserDto } from "./dto/create-user.dto/user.dto";

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);
	private readonly secret: Buffer;
	private readonly url = process.env.FRONT_END_URL;

	constructor(
		@InjectRepository(User)
		private userRepo: Repository<User>,
		@InjectRepository(PasswordRest)
		private passwordResetRepo: Repository<PasswordRest>,
		private emailService: EmailService
	) {
		this.secret = Buffer.from(process.env.SECRET_KEY, "hex");
	}

	async findOneByEmail(email: string): Promise<User | undefined> {
		return this.userRepo.findOneBy({ email });
	}

	async create(
		createUserDto: CreateUserDto
	): Promise<User | ErrorResponse | SuccessResponse> {
		const existingUser = await this.userRepo.findOne({
			where: { username: createUserDto.username },
		});

		//Check if user is under 18 years old
		console.log("User's date of birth: ", createUserDto.dob);

		// Convert dob to Date object if it's a string
		const dobDate =
			createUserDto.dob instanceof Date
				? createUserDto.dob
				: new Date(createUserDto.dob);

		// Calculate date 18 years ago
		const eighteenYearsAgo = new Date();
		eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

		console.log("Current date minus 18 years: ", eighteenYearsAgo);
		console.log("Parsed DOB: ", dobDate);

		if (dobDate > eighteenYearsAgo) {
			throw new ErrorResponse(
				"User must be at least 18 years old",
				"User is under 18 years old",
				410
			);
		}

		if (existingUser) {
			throw new ConflictResponse(
				"Username already taken, kinldy try another username"
			);
		}
		const token = this.generateToken(createUserDto.email);
		this.logger.log(
			`Generated token for user ${createUserDto.email}: ${token}`
		);

		const sendEmail = await this.emailService.sendEmail({
			to: createUserDto.email,
			subject: "Verify Your Email Address",
			templateName: "verify_email",
			context: {
				userName: createUserDto.firstName,
				companyName: "Thrive",
				currentYear: new Date().getFullYear(),
				companyAddress: "123 Thrive St, Thrive City, TC 12345",
				supportEmail: "" + process.env.SUPPORT_EMAIL,
				verificationUrl: `${this.url}?token=${token}`,
			},
		});

		this.logger.log("Email sent response: ", sendEmail);
		if (sendEmail instanceof ErrorResponse) {
			return new ErrorResponse(
				"Failed to send verification email",
				"Email Sending Error",
				500
			);
		}

		const salt = await bcrypt.genSalt();
		const user = this.userRepo.create(createUserDto);
		if (createUserDto.password) {
			user.password = await bcrypt.hash(user.password, salt);
		}

		await this.userRepo.save(user);
		this.logger.log(`User ${user.username} created successfully`);

		return new SuccessResponse(
			"User created successfully. Please check your email to verify your account."
		);
	}

	async getAllUsers(): Promise<UserDto[]> {
		const user = await this.userRepo.find({ where: { isActive: true } });
		if (!user) {
			this.logger.error("No active users found");
			return Promise.reject(new NotFoundResponse("No active users found"));
		}

		this.logger.log(`Found ${user} active users`);
		const updatedUsers = user.map((user) => {
			return {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				email: user.email,
				phoneNo: user.phoneNo,
				isActive: user.isActive,
				dob: user.dob,
				userType: user.userType,
				isVerified: user.isVerified,
				registrationDate: user.registrationDate,
			} as UserDto;
		});

		this.logger.log(`Returning ${updatedUsers.length} active users`);
		return updatedUsers;
	}

	getUser(username: string): Promise<User> {
		return this.userRepo.findOneBy({ username });
	}

	async updateUser(
		username: string,
		updateuserDto: UpdateUserDto
	): Promise<User> {
		await this.userRepo.update(username, updateuserDto);
		return this.userRepo.findOneBy({ username });
	}

	async deleteUser(username: string): Promise<void> {
		if (typeof username !== "string" || username.trim() === "") {
			throw new InvalidCredentialsResponse(
				"Invalid username",
				"Username must be a non-empty string",
				401
			);
		}

		const user = await this.userRepo.findOne({ where: { username } });
		console.log(user);
		if (!user) {
			throw new NotFoundResponse("User not found");
		}
		await this.userRepo.delete({ username });
		console.log(user);
	}

	async forgetPassword(
		email: string
	): Promise<SuccessResponse | NotFoundResponse> {
		this.logger.log(`Request to reset password for email: ${email}`);
		if (!email || typeof email !== "string" || email.trim() === "") {
			this.logger.error("Invalid email provided for password reset");
			return new InvalidCredentialsResponse(
				"Invalid email",
				"Email must be a non-empty string",
				401
			);
		}
		const user = await this.userRepo.findOneBy({ email });
		if (!user) {
			this.logger.log(`User with email ${email} not found`);
			return new NotFoundResponse("User not found");
		}

		this.logger.log(`User with email ${email} found, sending reset email`);

		const uniqueToken = this.generateToken(email);
		this.logger.log(`Generated token for ${email}: ${uniqueToken}`);

		const expirationDate = new Date();
		expirationDate.setHours(expirationDate.getHours() + 1); // Token valid for 1 hour

		const password_reset = this.passwordResetRepo.create({
			email: email,
			resetToken: uniqueToken,
			expirationDate: expirationDate,
			isUsed: false,
			userId: user.id,
		});

		await this.passwordResetRepo.save(password_reset);
		this.logger.log(`Password reset token saved for user ${user.username}`);

		// send reset password email logic here

		this.logger.log(`Sending reset password email to ${email}`);
		const response = await this.emailService.sendEmail({
			to: user.email,
			subject: "Password Reset Request",
			templateName: "password_rest",
			context: {
				name: user.username,
				resetLink: `${this.url}}/reset-password?token=${uniqueToken}`,
			},
		});

		this.logger.log("Email response received", response);
		if (response instanceof ErrorResponse) {
			this.logger.error(
				`Failed to send reset password email: ${response.message}`
			);
			return response;
		}

		this.logger.log(`Reset password email sent to ${email}`);
		return new SuccessResponse("Password reset email sent");
	}

	generateToken(email: string): string {
		const iv = crypto.randomBytes(12);
		const cipher = crypto.createCipheriv("aes-256-gcm", this.secret, iv);

		let encrypted = cipher.update(email, "utf8", "base64");
		encrypted += cipher.final("base64");

		const tag = cipher.getAuthTag().toString("base64");

		return `${iv.toString("base64")}.${tag}.${encrypted}`;
	}

	verifyToken(token: string): string | InvalidCredentialsResponse {
		const [iv64, tag64, encrypted] = token.split(".");
		if (!iv64 || !tag64 || !encrypted) {
			this.logger.error("Invalid token format");
			return new InvalidCredentialsResponse(
				"Invalid token",
				"Token must be a valid encrypted string",
				401
			);
		}

		const iv = Buffer.from(iv64, "base64");
		const tag = Buffer.from(tag64, "base64");
		if (iv.length !== 12 || tag.length !== 16) {
			this.logger.error("Invalid IV or tag length");
			return new InvalidCredentialsResponse(
				"Invalid token",
				"IV or tag must be of correct length",
				401
			);
		}
		this.logger.log(`Decrypting token with IV: ${iv64} and tag: ${tag64}`);
		try {
			const decipher = crypto.createDecipheriv("aes-256-gcm", this.secret, iv);
			decipher.setAuthTag(tag);

			let decrypted = decipher.update(encrypted, "base64", "utf8");
			decrypted += decipher.final("utf8");
			this.logger.log(`Decrypted email: ${decrypted}`);
			return decrypted;
		} catch (error) {
			this.logger.error("Failed to decrypt token", error);
			return new InvalidCredentialsResponse(
				"Invalid token",
				"Token must be a valid encrypted string",
				401
			);
		}
	}

	async resetPassword(
		resetDetails: ResetPasswordDto
	): Promise<SuccessResponse | NotFoundResponse | InvalidCredentialsResponse> {
		this.logger.log(
			`Request to reset password with token: ${resetDetails.token}`
		);
		const emailResult = this.verifyToken(resetDetails.token);
		const passwordRepos = await this.passwordResetRepo.findOne({
			where: { resetToken: resetDetails.token, isUsed: false },
		});

		if (!passwordRepos) {
			this.logger.error("Invalid or expired token provided for password reset");
			return new InvalidCredentialsResponse(
				"Invalid or expired token",
				"Token must be valid and not used",
				401
			);
		}

		// Check if the token has expired (expiration date is in the past)
		if (passwordRepos.expirationDate < new Date()) {
			this.logger.error("Token has expired - tokens are only valid for 1 hour");
			return new InvalidCredentialsResponse(
				"Token expired",
				"Password reset token has expired. Please request a new one.",
				401
			);
		}

		if (passwordRepos.isUsed) {
			this.logger.error("Token has already been used");
			return new InvalidCredentialsResponse(
				"Token already used",
				"Token must be valid and not used",
				401
			);
		}

		if (emailResult instanceof InvalidCredentialsResponse) {
			this.logger.error("Invalid token provided for password reset");
			return emailResult;
		}

		const user = await this.userRepo.findOneBy({ email: emailResult });
		if (!user) {
			this.logger.log(`User with email ${emailResult} not found`);
			return new NotFoundResponse("User not found");
		}

		const salt = await bcrypt.genSalt();
		user.password = await bcrypt.hash(resetDetails.newPassword, salt);
		await this.userRepo.update(user.id, { password: user.password });
		await this.passwordResetRepo.update(passwordRepos.id, {
			isUsed: true,
		});

		await this.emailService.sendEmail({
			to: user.email,
			subject: "Password Reset Confirmation",
			templateName: "reset_successful",
			context: {
				userName: user.firstName,
				companyName: "Thrive",
				currentYear: new Date().getFullYear(),
				companyAddress: "123 Thrive St, Thrive City, TC 12345",
				supportEmail: "iyiolakeni@gmail.com",
			},
		});

		this.logger.log(`Password reset successfully for user ${user.username}`);
		return new SuccessResponse("Password reset successfully");
	}

	async getUserById(id: string): Promise<UserResponse | NotFoundResponse> {
		const user = await this.userRepo.findOneBy({ id });
		if (!user) {
			this.logger.error(`User with ID ${id} not found`);
			return new NotFoundResponse("User not found");
		}
		return user;
	}

	async verifyUser(token: string): Promise<UserResponse | NotFoundResponse> {
		this.logger.log(`Verifying user with token: ${token}`);

		const email = this.verifyToken(token);
		if (email instanceof InvalidCredentialsResponse) {
			this.logger.error("Invalid token provided for user verification");
			return new InvalidCredentialsResponse(
				"Unverified User",
				"User verification failed. Invalid token.",
				401
			);
		}

		const user = await this.userRepo.findOneBy({ email });

		if (user.isVerified) {
			this.logger.warn(`User with email ${email} is already verified`);
			return new NotFoundResponse(
				"User already verified",
				"User Verification Error"
			);
		}

		if (!user) {
			this.logger.error(`User with email ${email} not found`);
			return new NotFoundResponse("User not found");
		}

		if (user.isVerified) {
			this.logger.warn(`User with email ${email} is already verified`);
			return new NotFoundResponse("User already verified");
		}

		user.isVerified = true;
		await this.userRepo.update(user.id, { isVerified: true });
		this.logger.log(`User with email ${email} verified successfully`);
		return {
			id: user.id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
		};
	}

	async search(
		searchFilter: SearchFilterDto
	): Promise<
		| SearchResponse<UserResponse[]>
		| SearchResponse<UserResponse>
		| ErrorResponse
	> {
		this.logger.log(
			`Searching users with filter: ${JSON.stringify(searchFilter)}`
		);

		const { searchTerm, sortBy, sortOrder, page, limit } = searchFilter;

		const queryBuilder = this.userRepo.createQueryBuilder("user");

		if (searchTerm) {
			queryBuilder.where("user.username LIKE :searchTerm", {
				searchTerm: `%${searchTerm}%`,
			});
		}

		if (page && limit) {
			queryBuilder.skip((page - 1) * limit).take(limit);
		}

		if (sortBy && sortOrder) {
			if (!["ASC", "DESC"].includes(sortOrder.toUpperCase())) {
				this.logger.error("Invalid sort order provided");
				return new ErrorResponse(
					"Invalid sort order. Use 'ASC' or 'DESC'.",
					"Sort Order Error",
					400
				);
			}

			if (!["username", "email", "phoneNo"].includes(sortBy)) {
				this.logger.error("Invalid sort field provided");
				return new ErrorResponse(
					"Invalid sort field. Use 'username', 'email', or 'phoneNo'.",
					"Invalid Sort Field",
					400
				);
			}

			queryBuilder.orderBy(
				`user.${sortBy}`,
				sortOrder.toUpperCase() as "ASC" | "DESC"
			);
		}

		const [users, total] = await queryBuilder.getManyAndCount();

		if (users.length === 0) {
			this.logger.warn("No users found matching the search criteria");
			return new ErrorResponse("No users found", "Search Error", 404);
		}

		this.logger.log(`Found ${users.length} users matching the search criteria`);

		return new SearchResponse(
			users,
			{
				total,
				page: page || 1,
				limit: limit || 10,
				totalPages: Math.ceil(total / (limit || 10)),
			},
			"User Search Results",
			200
		);
	}

	async activateUser(username: string): Promise<User | NotFoundResponse> {
		this.logger.log(`Activating user with username: ${username}`);
		const user = await this.userRepo.findOneBy({ username });
		if (!user) {
			this.logger.error(`User with username ${username} not found`);
			return new NotFoundResponse("User not found");
		}
		user.isActive = true;
		await this.userRepo.update(user.id, { isActive: true });
		this.logger.log(`User ${username} activated successfully`);
		return user;
	}

	async deactivateUser(username: string): Promise<User | NotFoundResponse> {
		this.logger.log(`Deactivating user with username: ${username}`);
		const user = await this.userRepo.findOneBy({ username });
		if (!user) {
			this.logger.error(`User with username ${username} not found`);
			return new NotFoundResponse("User not found");
		}
		user.isActive = false;
		await this.userRepo.update(user.id, { isActive: false });
		this.logger.log(`User ${username} deactivated successfully`);
		return user;
	}
}
