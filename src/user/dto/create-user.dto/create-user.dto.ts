import { ApiProperty } from "@nestjs/swagger";
import { UserType } from "src/entities/enum";

export class CreateUserDto {
	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty()
	username: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	phoneNo: string;

	@ApiProperty()
	dob: Date;

	@ApiProperty({ enum: UserType })
	userType: UserType;

	// @ApiProperty()
	registrationDate: Date;
}
