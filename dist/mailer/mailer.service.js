"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const nodemailer = require("nodemailer");
class MailerService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com',
            pass: 'your_app_password'
        }
    });
    async sendAlertEmail(to, studentName, flaggedMessages) {
        const htmlContent = `
      <h2>Alert: Problematic Content Detected in Chat</h2>
      <p>Hello,</p>
      <p>The system detected suspicious messages from student: <strong>${studentName}</strong>.</p>
      <p>Flagged messages:</p>
      <ul>
        ${flaggedMessages.map(msg => `<li>${msg}</li>`).join('')}
      </ul>
    `;
        await this.transporter.sendMail({
            from: '"RateChat Alerts" <your_email@gmail.com>',
            to,
            subject: 'Alert: Student Behavior in Chat',
            html: htmlContent
        });
    }
}
exports.MailerService = MailerService;
//# sourceMappingURL=mailer.service.js.map