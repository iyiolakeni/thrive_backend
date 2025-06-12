export class CreateEmailDto {
	to: string;
	subject: string;
	templateName: string;
	context: Record<string, any>;
}
