import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema/message.schema';
export declare class MessagesService {
    private messageModel;
    constructor(messageModel: Model<MessageDocument>);
    create(messageDto: Partial<Message>): Promise<Message>;
    saveMessage(sender: string, message: string, CHAT_ID: string, score: number): Promise<Message>;
    getMessagesByChat(CHAT_ID: string): Promise<Message[]>;
    getFlaggedMessages(CHAT_ID: string): Promise<Message[]>;
    getFlaggedMessagesByStudentEmail(studentEmail: string): Promise<Message[]>;
}
