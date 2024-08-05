import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "../create-user.dto/create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto){
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string

    @ApiProperty()
    phoneNo: string
    
    @ApiProperty()
    password: string

    @ApiProperty()
    isActive: boolean

    @ApiProperty()
    dob: Date 
}
