import { ApiProperty } from "@nestjs/swagger";
import { PrimaryGeneratedColumn } from "typeorm";

export class CreateBusinessDto {
  
    // Personal Information
    @ApiProperty()
    fullName: string;
  
    @ApiProperty()
    email: string;
  
    @ApiProperty()
    phone: string;
  
    // Business Information
    @ApiProperty()
    businessName: string;
  
    @ApiProperty()
    businessAddress: string;
  
    @ApiProperty()
    registrationNumber: string;
  
    // Store Information
    @ApiProperty()
    storeName: string;
  
    @ApiProperty()
    storeDescription: string;
  
    @ApiProperty({ nullable: true })
    storeLogo?: string; // Assume it's a URL or file path
  

    // Banking Information
    @ApiProperty()
    bankName: string;
  
    @ApiProperty()
    bankAccountNumber: string;
  
    @ApiProperty()
    bankAccountName: string;
  
    @ApiProperty({ nullable: true })
    swiftCode?: string;
  
    // Legal and Compliance
    @ApiProperty({ default: true })
    vendorAgreement: boolean;
  
    // Product Information
    @ApiProperty()
    productCategories: string[];
  
    // Shipping and Return Policy
    @ApiProperty({default: true})
    returnPolicy: boolean
}
