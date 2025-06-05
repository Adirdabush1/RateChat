import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    getMessages(CHAT_ID: string): Promise<import("./message.schema/message.schema").Message[]>;
    createMessage(body: {
        CHAT_ID: string;
        sender: string;
        message: string;
    }): Promise<import("./message.schema/message.schema").Message>;
}
