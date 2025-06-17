"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const messages_service_1 = require("../messages/messages.service");
const mailer_service_1 = require("../mailer/mailer.service");
let ParentService = class ParentService {
    usersService;
    messagesService;
    mailerService;
    constructor(usersService, messagesService, mailerService) {
        this.usersService = usersService;
        this.messagesService = messagesService;
        this.mailerService = mailerService;
    }
    async getStudentInfo(studentEmail) {
        const student = await this.usersService.findByEmail(studentEmail);
        if (!student) {
            return null;
        }
        const flaggedMessages = await this.messagesService.getFlaggedMessagesByStudentEmail(studentEmail);
        if (flaggedMessages.length > 0 && student.parentEmail) {
            await this.mailerService.sendAlertEmail(student.parentEmail, student.email, flaggedMessages.map(msg => msg.message));
        }
        return {
            name: student.email,
            score: student.score,
            flaggedMessages,
        };
    }
    async handleNewMessage(sender, message, chatId, score) {
        const savedMessage = await this.messagesService.saveMessage(sender, message, chatId, score);
        if (score < 50) {
            const student = await this.usersService.findByEmail(sender);
            if (student) {
                student.score = Math.max(0, student.score - 5);
                await this.usersService.updateScore(student.email, student.score);
                if (student.parentEmail) {
                    await this.mailerService.sendAlertEmail(student.parentEmail, student.name || student.email, [message]);
                }
            }
        }
        return savedMessage;
    }
};
exports.ParentService = ParentService;
exports.ParentService = ParentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        messages_service_1.MessagesService,
        mailer_service_1.MailerService])
], ParentService);
//# sourceMappingURL=perent.service.js.map