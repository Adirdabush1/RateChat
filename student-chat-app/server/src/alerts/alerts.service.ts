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
      user: process.env.EMAIL_USER, // Gmail address
      pass: process.env.EMAIL_PASS, // App password (not regular password)
    },
  });

  async sendAlertEmail(to: string, message: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Alert: Suspicious Message Detected',
      text: message,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Alert email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  sendAlertToParent(alert: CreateAlertDto, message?: Message): Promise<void> {
    const { studentEmail, message: alertMessage } = alert;
    return this.sendAlertEmail(studentEmail, alertMessage);
  }
}
