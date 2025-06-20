import { User } from "../user.entity/user.entity";
import { Product } from "src/products/entities/product.entity";
export declare class Business {
    id: string;
    businessName: string;
    businessAddress: string;
    registrationNumber?: string;
    storeLogo?: string;
    bankName: string;
    bankAccountNumber: string;
    bank_code: string;
    vendorAgreement: boolean;
    returnPolicy: boolean;
    user: User;
    userId: string;
    isVerified: boolean;
    registrationDate: Date;
    verificationDate?: Date;
    isActive: boolean;
    modificationDate?: Date;
    products: Product[];
}
//# sourceMappingURL=business.entity.d.ts.map