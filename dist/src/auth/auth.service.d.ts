import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "src/user/dto/login.dto";
import { DataResponse, InvalidCredentialsResponse, LoginResponse, NotFoundResponse } from "src/models/response.dto";
import { UserResponse } from "src/models/userResponse.dto";
import { ConfigService } from "@nestjs/config";
import { SharedService } from "src/shared-service/shared-service.service";
import { LoginDetails } from "src/entities/login.entity/logindetails.entity";
import { Repository } from "typeorm";
export declare class AuthService {
    private sharedService;
    private jwtService;
    private configService;
    private loginDetailsRepo;
    constructor(sharedService: SharedService, jwtService: JwtService, configService: ConfigService, loginDetailsRepo: Repository<LoginDetails>);
    validateUser(email: string, password: string): Promise<DataResponse<UserResponse> | InvalidCredentialsResponse | NotFoundResponse>;
    login(loginDto: LoginDto, meta: {
        ipAddress: string;
        userAgent: string;
        deviceInfo: string;
        location: string;
    }): Promise<LoginResponse | InvalidCredentialsResponse | NotFoundResponse>;
    saveLoginDetails(userId: string, meta: {
        ipAddress: string;
        userAgent: string;
        deviceInfo: string;
        location: string;
    }, response: {
        statusCode: number;
        message?: string;
    }): Promise<LoginDetails>;
}
//# sourceMappingURL=auth.service.d.ts.map