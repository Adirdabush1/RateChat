import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
export declare class UsersController {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    getChildrenByParent(parentEmail: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
