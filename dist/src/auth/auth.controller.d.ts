import { AuthService } from './auth.service';
import { LoginDto } from 'src/user/dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map