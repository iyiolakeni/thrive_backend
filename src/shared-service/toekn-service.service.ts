import { Injectable } from "@nestjs/common";
import { BadRequestResponse } from "src/models/response.dto";

@Injectable()
export class TokenService {
	async extractToken(authorization: string) {
		if (!authorization) {
			throw new BadRequestResponse("Authorization header is required");
		}

		if (!authorization.startsWith("Bearer ")) {
			throw new BadRequestResponse(
				"Invalid authorization header format. Expected: Bearer <token>"
			);
		}

		const token = authorization.replace("Bearer ", "").trim();
		if (!token) {
			throw new BadRequestResponse("Token is required");
		}

		return token;
	}
}
