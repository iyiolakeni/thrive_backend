import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Business {
    @PrimaryGeneratedColumn()
    id: number;
  
    // Personal Information
    @Column()
    fullName: string;
  
    @Column()
    email: string;
  
    @Column()
    phone: string;
  
    // Business Information
    @Column()
    businessName: string;
  
    @Column()
    businessAddress: string;
  
    @Column()
    registrationNumber: string;
  
    // Store Information
    @Column()
    storeName: string;
  
    @Column('text')
    storeDescription: string;
  
    @Column({ nullable: true })
    storeLogo?: string; // Assume it's a URL or file path
  

    // Banking Information
    @Column()
    bankName: string;
  
    @Column()
    bankAccountNumber: string;
  
    @Column()
    bankAccountName: string;
  
    @Column({ nullable: true })
    swiftCode?: string;
  
    // Legal and Compliance
    @Column({ default: true })
    vendorAgreement: boolean;
  
    // Product Information
    @Column('simple-array')
    productCategories: string[];
  
    // Shipping and Return Policy
    @Column({default: true})
    returnPolicy: boolean
}
