import { User } from "src/entities/user.entity/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto/update-user.dto";
import { ErrorResponse, InvalidCredentialsResponse, NotFoundResponse, SearchResponse, SuccessResponse } from "src/models/response.dto";
import { PasswordRest } from "src/entities/user.entity/password.entity";
import { EmailService } from "src/email/email.service";
import { ResetPasswordDto } from "./dto/reset_password.dto";
import { UserResponse } from "src/models/userResponse.dto";
import { SearchFilterDto } from "src/product-categories/dto/search-filter.dto";
export declare class UserService {
    private userRepo;
    private passwordResetRepo;
    private emailService;
    private readonly logger;
    private readonly secret;
    private readonly url;
    constructor(userRepo: Repository<User>, passwordResetRepo: Repository<PasswordRest>, emailService: EmailService);
    findOneByEmail(email: string): Promise<User | undefined>;
    create(createUserDto: CreateUserDto): Promise<User | ErrorResponse | SuccessResponse>;
    getAllUsers(): Promise<User[]>;
    getUser(username: string): Promise<User>;
    updateUser(username: string, updateuserDto: UpdateUserDto): Promise<User>;
    deleteUser(username: string): Promise<void>;
    forgetPassword(email: string): Promise<SuccessResponse | NotFoundResponse>;
    generateToken(email: string): string;
    verifyToken(token: string): string | InvalidCredentialsResponse;
    resetPassword(resetDetails: ResetPasswordDto): Promise<SuccessResponse | NotFoundResponse | InvalidCredentialsResponse>;
    getUserById(id: string): Promise<UserResponse | NotFoundResponse>;
    verifyUser(token: string): Promise<UserResponse | NotFoundResponse>;
    search(searchFilter: SearchFilterDto): Promise<SearchResponse<UserResponse[]> | SearchResponse<UserResponse> | ErrorResponse>;
    activateUser(username: string): Promise<User | NotFoundResponse>;
    deactivateUser(username: string): Promise<User | NotFoundResponse>;
}
//# sourceMappingURL=user.service.d.ts.map