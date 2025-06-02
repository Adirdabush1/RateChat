// src/alerts/alerts.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateAlertDto } from './dto/create-alert.dto';
import { Message } from 'src/messages/message.schema/message.schema';

@Injectable()
export class AlertsService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // כתובת Gmail
      pass: process.env.EMAIL_PASS, // סיסמת אפליקציה (ולא סיסמה רגילה)
    },
  });

  async sendAlertEmail(to: string, message: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'התראה על הודעה חריגה',
      text: message,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`נשלחה הודעת התראה אל ${to}`);
    } catch (error) {
      console.error('שגיאה בשליחת מייל:', error);
    }
  }
sendAlertToParent(alert: CreateAlertDto, Message?: Message): Promise<void> {
  const { studentEmail, message } = alert;
  return this.sendAlertEmail(studentEmail, message);
}

}
