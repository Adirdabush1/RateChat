import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterParentDto } from './dto/register-parent.dto';
import { Model } from 'mongoose';
import { Parent } from '../perent/parent.schema';
export declare class AuthService {
    private parentModel;
    private usersService;
    private jwtService;
    constructor(parentModel: Model<Parent>, usersService: UsersService, jwtService: JwtService);
    hashPassword(password: string): Promise<string>;
    register(email: string, password: string, role?: string): Promise<{
        message: string;
    }>;
    validateUser(email: string, password: string): Promise<import("../users/user.schema").User | null>;
    login(email: string, password: string): Promise<{
        access_token: string;
        name: any;
    }>;
    registerParent(dto: RegisterParentDto): Promise<import("mongoose").Document<unknown, {}, Parent, {}> & Parent & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    loginParent(email: string, password: string): Promise<{
        access_token: string;
        name: string;
    }>;
}
