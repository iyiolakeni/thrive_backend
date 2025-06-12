import { AuthService } from "./auth.service";
import { LoginDto } from "src/user/dto/login.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, meta: any): Promise<import("../models/response.dto").InvalidCredentialsResponse | import("../models/response.dto").NotFoundResponse | import("../models/response.dto").LoginResponse>;
}
//# sourceMappingURL=auth.controller.d.ts.map