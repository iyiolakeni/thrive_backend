import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string

    @ApiProperty()
    password: string

    @ApiProperty()
    phoneNo: string

    @ApiProperty()
    isActive: boolean

    @ApiProperty()
    lastLogin: Date;

    @ApiProperty()
    dob: Date 

    @ApiProperty()
    registrationDate: Date
}
