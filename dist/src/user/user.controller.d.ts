import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto/create-user.dto";
import { User } from "src/entities/user.entity/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto/update-user.dto";
import { NotFoundResponse, SuccessResponse } from "src/models/response.dto";
import { EmailDto } from "src/email/dto/email.dto";
import { ResetPasswordDto } from "./dto/reset_password.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserdto: CreateUserDto): Promise<User>;
    getAllusers(): Promise<User[]>;
    getUser(username: string): Promise<User>;
    updateUser(username: string, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(username: string): Promise<void>;
    resetPasword(email: EmailDto): Promise<SuccessResponse | NotFoundResponse>;
    resetPassword(resetDetails: ResetPasswordDto): Promise<SuccessResponse | NotFoundResponse>;
}
//# sourceMappingURL=user.controller.d.ts.map