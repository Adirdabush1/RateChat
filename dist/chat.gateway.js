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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("axios");
const analyzeMessage_1 = require("./service/analyzeMessage");
const messages_service_1 = require("./messages/messages.service");
const users_service_1 = require("./users/users.service");
let ChatGateway = class ChatGateway {
    messagesService;
    jwtService;
    usersService;
    server;
    logger = new common_1.Logger('ChatGateway');
    parentSockets = new Map();
    constructor(messagesService, jwtService, usersService) {
        this.messagesService = messagesService;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async onModuleInit() {
        this.logger.log('ChatGateway initialized');
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            const chatId = client.handshake.auth.chatId;
            this.logger.log(`handleConnection - received token: ${token}`);
            this.logger.log(`handleConnection - received chatId: ${chatId}`);
            const payload = this.jwtService.verify(token);
            client.data.user = payload;
            client.data.chatId = chatId;
            client.join(chatId);
            this.logger.log(`Client connected: ${payload.email} to chat ${chatId}`);
            const history = await this.messagesService.getMessagesByChat(chatId);
            client.emit('chat_history', history);
            this.server.to(chatId).emit('receive_message', {
                sender: 'System',
                message: `wallcome to  ${chatId}`,
            });
        }
        catch (err) {
            this.logger.error('Invalid token', err.message);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const email = client.data.user?.email || client.id;
        const chatId = client.data.chatId || 'unknown chat';
        this.logger.log(`Client disconnected: ${email} from chat ${chatId}`);
        if (this.parentSockets.has(email)) {
            this.parentSockets.delete(email);
            this.logger.log(`Removed parent socket for ${email}`);
        }
        this.server.to(chatId).emit('receive_message', {
            sender: 'System',
            message: `${email} disconnected from chat`,
            chatId,
        });
    }
    handleRegisterParent(parentEmail, client) {
        this.parentSockets.set(parentEmail, client);
        this.logger.log(`Parent registered: ${parentEmail} with socket ${client.id}`);
    }
    async onSendMessage(data, client) {
        const user = client.data.user;
        const chatId = client.data.chatId;
        if (!user || !chatId) {
            this.logger.warn('Unauthorized user or missing chatId tried to send message');
            return;
        }
        try {
            const analysis = await (0, analyzeMessage_1.analyzeMessageEnglish)(data.message);
            if (analysis.toxic) {
                this.logger.warn('Toxic message detected:', analysis.reason);
                if (analysis.alertParent) {
                }
            }
            const score = typeof analysis.score === 'number' ? analysis.score : 0;
            const scoreChange = typeof analysis.scoreChange === 'number' ? analysis.scoreChange : 0;
            const saved = await this.messagesService.saveMessage(user.email, data.message, chatId, score);
            this.server.to(chatId).emit('receive_message', {
                sender: saved.sender,
                message: saved.message,
                score,
                chatId,
            });
            if (analysis.alertParent) {
                this.logger.warn(`Alert for parent! Reason: ${analysis.reason}`);
                try {
                    await axios_1.default.post('https://your-api-url.com/alert', {
                        studentEmail: user.email,
                        message: data.message,
                        chatId: chatId,
                        reason: analysis.reason,
                        timestamp: new Date().toISOString(),
                    });
                    this.logger.log(`Alert sent to parent for ${user.email}`);
                }
                catch (error) {
                    this.logger.error('Failed to send alert to parent:', error.message);
                }
                const parentSocket = this.parentSockets.get(user.email);
                if (parentSocket) {
                    const currentScore = await this.usersService.updateUserScore(user.email, scoreChange);
                    const flaggedMessages = await this.messagesService.getFlaggedMessages(user.email);
                    parentSocket.emit('studentDataUpdate', {
                        name: user.email,
                        score: currentScore,
                        flaggedMessages,
                    });
                    this.logger.log(`Real-time update sent to parent ${user.email}`);
                }
            }
            await this.usersService.updateUserScore(user.email, scoreChange);
        }
        catch (err) {
            this.logger.error('Error in onSendMessage:', err);
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('registerParent'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleRegisterParent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "onSendMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'https://ratechat-f72a4557d4ab.herokuapp.com',
            methods: ['GET', 'POST'],
        },
    }),
    __metadata("design:paramtypes", [messages_service_1.MessagesService,
    jwt_1.JwtService,
    users_service_1.UsersService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map