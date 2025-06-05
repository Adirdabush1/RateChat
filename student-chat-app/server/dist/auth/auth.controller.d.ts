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
    registerParent(body: RegisterParentDto): Promise<import("mongoose").Document<unknown, {}, import("../perent/parent.schema").Parent, {}> & import("../perent/parent.schema").Parent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    loginParent(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        name: string;
    }>;
}
