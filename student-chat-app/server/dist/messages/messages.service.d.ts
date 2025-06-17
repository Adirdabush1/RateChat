import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema/message.schema';
export declare class MessagesService {
    private messageModel;
    constructor(messageModel: Model<MessageDocument>);
    create(messageDto: Partial<Message>): Promise<Message>;
    saveMessage(sender: string, message: string, chatId: string, score: number, flagged?: boolean): Promise<Message>;
    getMessagesByChat(chatId: string): Promise<Message[]>;
    getFlaggedMessages(chatId: string): Promise<Message[]>;
    getFlaggedMessagesByStudentEmail(studentEmail: string): Promise<Message[]>;
}
