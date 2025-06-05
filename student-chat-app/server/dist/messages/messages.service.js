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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("./message.schema/message.schema");
let MessagesService = class MessagesService {
    messageModel;
    constructor(messageModel) {
        this.messageModel = messageModel;
    }
    async create(messageDto) {
        const createdMessage = new this.messageModel(messageDto);
        return createdMessage.save();
    }
    async saveMessage(sender, message, CHAT_ID, score) {
        const messageObj = {
            sender,
            message,
            CHAT_ID,
            score,
            timestamp: new Date(),
        };
        return this.create(messageObj);
    }
    async getMessagesByChat(CHAT_ID) {
        return this.messageModel.find({ CHAT_ID }).exec();
    }
    async getFlaggedMessages(CHAT_ID) {
        return this.messageModel.find({ CHAT_ID, score: { $lt: 50 } }).exec();
    }
    async getFlaggedMessagesByStudentEmail(studentEmail) {
        return this.messageModel.find({ sender: studentEmail, flagged: true }).exec();
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MessagesService);
//# sourceMappingURL=messages.service.js.map