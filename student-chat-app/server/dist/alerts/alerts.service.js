"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let AlertsService = class AlertsService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    async sendAlertEmail(to, message) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Alert: Suspicious Message Detected',
            text: message,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Alert email sent to ${to}`);
        }
        catch (error) {
            console.error('Error sending email:', error);
        }
    }
    sendAlertToParent(alert, message) {
        const { studentEmail, message: alertMessage } = alert;
        return this.sendAlertEmail(studentEmail, alertMessage);
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)()
], AlertsService);
//# sourceMappingURL=alerts.service.js.map