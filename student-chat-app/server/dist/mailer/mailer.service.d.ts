export declare class MailerService {
    private transporter;
    sendAlertEmail(to: string, studentName: string, flaggedMessages: string[]): Promise<void>;
}
