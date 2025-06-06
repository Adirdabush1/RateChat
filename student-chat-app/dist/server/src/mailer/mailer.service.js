"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerService = void 0;
const nodemailer = __importStar(require("nodemailer"));
class MailerService {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com', // Enter your email address
            pass: 'your_app_password' // App password (not the regular password)
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