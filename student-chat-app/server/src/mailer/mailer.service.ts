import * as nodemailer from 'nodemailer';

export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com', // Enter your email address
      pass: 'your_app_password'     // App password (not the regular password)
    }
  });

  async sendAlertEmail(to: string, studentName: string, flaggedMessages: string[]) {
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
