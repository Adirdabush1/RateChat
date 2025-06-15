import { CreateAlertDto } from './dto/create-alert.dto';
import { Message } from 'src/messages/message.schema/message.schema';
export declare class AlertsService {
    private transporter;
    sendAlertEmail(to: string, message: string): Promise<void>;
    sendAlertToParent(alert: CreateAlertDto, message?: Message): Promise<void>;
}
