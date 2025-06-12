import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RequestMeta = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		return {
			ipAddress:
				(request.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
				request.socket.remoteAddress,
			userAgent: request.headers["user-agent"] || "Unknown",
			deviceInfo: request.headers["sec-ch-ua"] || "Generic Device",
			location: request.headers["x-forwarded-for"]
				? request.headers["x-forwarded-for"].split(",")[0].trim()
				: request.socket.remoteAddress,
		};
	}
);
