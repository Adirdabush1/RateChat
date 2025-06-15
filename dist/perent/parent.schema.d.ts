import { Schema, Document } from 'mongoose';
export interface Parent extends Document {
    name: string;
    email: string;
    password: string;
    childEmail: string;
}
export declare const ParentSchema: Schema<Parent, import("mongoose").Model<Parent, any, any, any, Document<unknown, any, Parent, any> & Parent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Parent, Document<unknown, {}, import("mongoose").FlatRecord<Parent>, {}> & import("mongoose").FlatRecord<Parent> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
