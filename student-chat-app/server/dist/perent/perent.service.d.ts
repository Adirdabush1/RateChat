import { UsersService } from '../users/users.service';
import { MessagesService } from '../messages/messages.service';
import { MailerService } from '../mailer/mailer.service';
export declare class ParentService {
    private readonly usersService;
    private readonly messagesService;
    private readonly mailerService;
    constructor(usersService: UsersService, messagesService: MessagesService, mailerService: MailerService);
    getStudentInfo(studentEmail: string): Promise<{
        name: string;
        score: number;
        flaggedMessages: any[];
    } | null>;
    handleNewMessage(sender: string, message: string, CHAT_ID: string, score: number): Promise<import("../messages/message.schema/message.schema").Message>;
}
