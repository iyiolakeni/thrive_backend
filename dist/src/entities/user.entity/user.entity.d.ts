import { UserType } from "../enum";
import { LoginDetails } from "../login.entity/logindetails.entity";
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phoneNo: string;
    password: string;
    isActive: boolean;
    dob: Date;
    userType: UserType;
    registrationDate: Date;
    loginHistory: LoginDetails[];
}
//# sourceMappingURL=user.entity.d.ts.map