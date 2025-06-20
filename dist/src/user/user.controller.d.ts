import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto/create-user.dto";
import { User } from "src/entities/user.entity/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto/update-user.dto";
import { ErrorResponse, NotFoundResponse, SearchResponse, SuccessResponse } from "src/models/response.dto";
import { EmailDto } from "src/email/dto/email.dto";
import { ResetPasswordDto } from "./dto/reset_password.dto";
import { UserResponse } from "src/models/userResponse.dto";
import { SearchFilterDto } from "src/product-categories/dto/search-filter.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserdto: CreateUserDto): Promise<User | ErrorResponse | SuccessResponse>;
    getAllusers(): Promise<User[]>;
    getUser(username: string): Promise<User>;
    updateUser(username: string, updateUserDto: UpdateUserDto): Promise<User>;
    deleteUser(username: string): Promise<void>;
    resetPasword(email: EmailDto): Promise<SuccessResponse | NotFoundResponse>;
    resetPassword(resetDetails: ResetPasswordDto): Promise<SuccessResponse | NotFoundResponse>;
    getUserById(id: string): Promise<UserResponse | NotFoundResponse>;
    searchUser(searchFilter: SearchFilterDto): Promise<SearchResponse<UserResponse> | SearchResponse<UserResponse[]> | NotFoundResponse>;
    activateUser(username: string): Promise<User | NotFoundResponse>;
    deactivateUser(username: string): Promise<User | NotFoundResponse>;
    verifyEmail(token: string): Promise<UserResponse | NotFoundResponse>;
}
//# sourceMappingURL=user.controller.d.ts.map