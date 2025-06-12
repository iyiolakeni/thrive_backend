import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto/update-user.dto";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import {
	ConflictResponse,
	ErrorResponse,
	InvalidCredentialsResponse,
	NotFoundResponse,
	SuccessResponse,
} from "src/models/response.dto";
import { Injectable, Logger } from "@nestjs/common";
import { PasswordRest } from "src/entities/user.entity/password.entity";
import { getuid } from "process";
import { EmailService } from "src/email/email.service";
import { ResetPasswordDto } from "./dto/reset_password.dto";

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);
	private readonly secret: Buffer;

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

	// async findOneByPhone(phoneNo: string): Promise<User | undefined>{
	//     return this.userRepo.findOne({where:{phoneNo}})
	// }

	async create(createUserDto: CreateUserDto): Promise<User> {
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
		const user = this.userRepo.create(createUserDto);
		const salt = await bcrypt.genSalt();
		if (createUserDto.password) {
			user.password = await bcrypt.hash(user.password, salt);
		}
		return this.userRepo.save(user);
	}

	getAllUsers(): Promise<User[]> {
		return this.userRepo.find();
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
				resetLink: `https://thrive.com/reset-password?token=${uniqueToken}`,
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
}
