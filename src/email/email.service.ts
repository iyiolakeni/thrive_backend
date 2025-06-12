import { Injectable, Logger } from "@nestjs/common";
import { CreateEmailDto } from "./dto/create-email.dto";
import { UpdateEmailDto } from "./dto/update-email.dto";
import { ConfigService } from "@nestjs/config";
import * as mailer from "@sendgrid/mail";
import * as path from "path";
import * as fs from "fs";
import * as handler from "handlebars";
import {
	ErrorResponse,
	NotFoundResponse,
	SuccessResponse,
} from "src/models/response.dto";

@Injectable()
export class EmailService {
	private readonly logger = new Logger(EmailService.name);
	private readonly fromEmail: string;

	constructor(private readonly configService: ConfigService) {
		const apiKey = this.configService.get<string>("SENDGRID_APIKEY");
		this.fromEmail = this.configService.get<string>("EMAIL_FROM");
		this.logger.log("Email service initialized with SendGrid API key.");
		this.logger.log(`From email: ${this.fromEmail}`);
		mailer.setApiKey(apiKey);
	}

	private compileTemplate(
		templateName: string,
		context: Record<string, any>
	): string {
		const filePath = path.join(__dirname, "templates", `${templateName}.hbs`);
		this.logger.log(`Loading template from: ${filePath}`);
		if (!fs.existsSync(filePath)) {
			this.logger.error(`Template file not found: ${filePath}`);
			throw new NotFoundResponse(`Template not found: ${templateName}`);
		}

		try {
			const source = fs.readFileSync(filePath, "utf8");
			const template = handler.compile(source);
			return template(context);
		} catch (error) {
			this.logger.error(`Failed to compile template: ${templateName}`, error);
			throw new Error(`Template not found: ${templateName}`);
		}
	}

	async sendEmail(
		createEmailDto: CreateEmailDto
	): Promise<SuccessResponse | ErrorResponse> {
		const { to, subject, templateName, context } = createEmailDto;

		this.logger.log("Preparing to send email...");
		this.logger.log(`To: ${to}`);
		this.logger.log("Reset Link: ", context.resetLink);
		const htmlContent = this.compileTemplate(templateName, context);

		const msg = {
			to,
			from: this.fromEmail,
			subject,
			html: htmlContent,
		};

		try {
			await mailer.send(msg);
			this.logger.log(`Email sent successfully to ${to}`);
			return new SuccessResponse(`Email sent successfully to ${to}`);
		} catch (error) {
			this.logger.error(`Failed to send email to ${to}`, error);

			return new ErrorResponse(
				`Failed to send email to ${to}`,
				"Email sending failed"
			);
		}
	}
}
