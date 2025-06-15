import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getMessages(chatId: string): Promise<import("./message.schema/message.schema").Message[]>;
    createMessage(body: {
        chatId: string;
        sender: string;
        message: string;
    }): Promise<import("./message.schema/message.schema").Message>;
}
