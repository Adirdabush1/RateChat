import { AuthService } from './auth.service';
import { RegisterParentDto } from './dto/register-parent.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        role?: string;
    }): Promise<{
        message: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        name: any;
    }>;
    registerParent(body: RegisterParentDto): Promise<{
        message: string;
        access_token: string;
        name: string;
    }>;
    loginParent(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        name: string;
    }>;
}
