import { ApiProperty } from "@nestjs/swagger";

export class UpdateBusinessDto {
    @ApiProperty()
    fullName: string

    @ApiProperty()
    email: string

    @ApiProperty()
    phone:string
    @ApiProperty()
    bankName: string
    @ApiProperty()
    bankAccountNumber: string
    @ApiProperty()
    bankAccountName: string
    @ApiProperty()
    swiftCode: string

}
