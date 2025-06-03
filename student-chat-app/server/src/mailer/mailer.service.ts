import * as nodemailer from 'nodemailer';

export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com', // הכנס את כתובת המייל שלך
      pass: 'your_app_password'     // סיסמת אפליקציה (לא הסיסמה הרגילה)
    }
  });

  async sendAlertEmail(to: string, studentName: string, flaggedMessages: string[]) {
    const htmlContent = `
      <h2>התראה על תוכן בעייתי בצ'אט</h2>
      <p>שלום,</p>
      <p>המערכת זיהתה הודעות חשודות מהתלמיד: <strong>${studentName}</strong>.</p>
      <p>הודעות שסומנו:</p>
      <ul>
        ${flaggedMessages.map(msg => `<li>${msg}</li>`).join('')}
      </ul>
    `;

    await this.transporter.sendMail({
      from: '"RateChat Alerts" <your_email@gmail.com>',
      to,
      subject: 'התראה על התנהגות תלמיד בצ׳אט',
      html: htmlContent
    });
  }
}
