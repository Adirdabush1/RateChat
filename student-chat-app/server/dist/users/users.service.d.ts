import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findByEmail(email: string): Promise<User | null>;
    createUser(email: string, hashedPassword: string, role: string): Promise<User>;
    registerUser(email: string, password: string, role?: string): Promise<User>;
    updateUserScore(email: string, amount: number): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findChildrenByParentEmail(parentEmail: string): Promise<User[]>;
    updateScore(email: string, newScore: number): Promise<User | null>;
}
