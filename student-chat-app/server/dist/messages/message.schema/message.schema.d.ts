import { Document } from 'mongoose';
export type MessageDocument = Message & Document;
export declare class Message {
    sender: string;
    text: string;
    message: string;
    chatId: string;
    createdAt: Date;
    score: number;
    mood: string;
    userId: string;
    content: string;
    chatId: string;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message, any> & Message & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>, {}> & import("mongoose").FlatRecord<Message> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
