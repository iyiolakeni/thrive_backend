import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity/user.entity";
import { DataResponse, NotFoundResponse } from "src/models/response.dto";
import { UserResponse } from "src/models/userResponse.dto";
import { Repository } from "typeorm";

@Injectable()
export class SharedService {
	constructor(
		@InjectRepository(User)
		private userRepo: Repository<User>
	) {}

	async findOneByEmail(
		email: string
	): Promise<DataResponse<User> | NotFoundResponse> {
		const user = await this.userRepo.findOneBy({ email });

		if (!user) {
			return new NotFoundResponse("User not found");
		}
		return new DataResponse<User>(user, "User found");
	}

	async findOneByUsername(
		username: string
	): Promise<DataResponse<UserResponse> | NotFoundResponse> {
		const user = await this.userRepo.findOneBy({ username });

		if (!user) {
			return new NotFoundResponse("User not found");
		}

		return new DataResponse<UserResponse>(user, "User Found");
	}
}
