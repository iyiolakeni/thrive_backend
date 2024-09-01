import { CreateUserDto } from "../create-user.dto/create-user.dto";
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    firstName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    password: string;
    isActive: boolean;
    dob: Date;
}
export {};
//# sourceMappingURL=update-user.dto.d.ts.map