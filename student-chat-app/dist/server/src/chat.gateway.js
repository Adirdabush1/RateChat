"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const analyzeMessage_1 = require("./service/analyzeMessage");
const allowedOrigins = [
    'http://localhost:5173',
    'https://ratechat2.onrender.com',
    // הוסף כאן עוד דומיינים לפי הצורך
];
let ChatGateway = (() => {
    let _classDecorators = [(0, websockets_1.WebSocketGateway)({
            cors: {
                origin: (origin, callback) => {
                    if (!origin || allowedOrigins.includes(origin)) {
                        callback(null, true);
                    }
                    else {
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                methods: ['GET', 'POST'],
                credentials: true,
            },
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _server_decorators;
    let _server_initializers = [];
    let _server_extraInitializers = [];
    let _handleRegisterParent_decorators;
    let _onSendMessage_decorators;
    var ChatGateway = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _server_decorators = [(0, websockets_1.WebSocketServer)()];
            _handleRegisterParent_decorators = [(0, websockets_1.SubscribeMessage)('registerParent')];
            _onSendMessage_decorators = [(0, websockets_1.SubscribeMessage)('send_message')];
            __esDecorate(this, null, _handleRegisterParent_decorators, { kind: "method", name: "handleRegisterParent", static: false, private: false, access: { has: obj => "handleRegisterParent" in obj, get: obj => obj.handleRegisterParent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _onSendMessage_decorators, { kind: "method", name: "onSendMessage", static: false, private: false, access: { has: obj => "onSendMessage" in obj, get: obj => obj.onSendMessage }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: obj => "server" in obj, get: obj => obj.server, set: (obj, value) => { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ChatGateway = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        messagesService = __runInitializers(this, _instanceExtraInitializers);
        jwtService;
        usersService;
        server = __runInitializers(this, _server_initializers, void 0);
        logger = (__runInitializers(this, _server_extraInitializers), new common_1.Logger('ChatGateway'));
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
                const CHAT_ID = client.handshake.auth.CHAT_ID;
                this.logger.log(`handleConnection - received token: ${token}`);
                this.logger.log(`handleConnection - received CHAT_ID: ${CHAT_ID}`);
                const payload = this.jwtService.verify(token);
                client.data.user = payload;
                client.data.CHAT_ID = CHAT_ID;
                client.join(CHAT_ID);
                this.logger.log(`Client connected: ${payload.email} to chat ${CHAT_ID}`);
                const history = await this.messagesService.getMessagesByChat(CHAT_ID);
                client.emit('chat_history', history);
                this.server.to(CHAT_ID).emit('receive_message', {
                    sender: 'System',
                    message: `${payload.email} joined chat ${CHAT_ID}`,
                });
            }
            catch (err) {
                this.logger.error('Invalid token', err.message);
                client.disconnect();
            }
        }
        handleDisconnect(client) {
            const email = client.data.user?.email || client.id;
            const CHAT_ID = client.data.CHAT_ID || 'unknown chat';
            this.logger.log(`Client disconnected: ${email} from chat ${CHAT_ID}`);
            if (this.parentSockets.has(email)) {
                this.parentSockets.delete(email);
                this.logger.log(`Removed parent socket for ${email}`);
            }
            this.server.to(CHAT_ID).emit('receive_message', {
                sender: 'System',
                message: `${email} disconnected from chat`,
                CHAT_ID,
            });
        }
        handleRegisterParent(parentEmail, client) {
            this.parentSockets.set(parentEmail, client);
            this.logger.log(`Parent registered: ${parentEmail} with socket ${client.id}`);
        }
        async onSendMessage(data, client) {
            const user = client.data.user;
            const CHAT_ID = client.data.CHAT_ID;
            if (!user || !CHAT_ID) {
                this.logger.warn('Unauthorized user or missing CHAT_ID tried to send message');
                return;
            }
            try {
                const analysis = await (0, analyzeMessage_1.analyzeMessageEnglish)(data.message);
                if (analysis.toxic) {
                    this.logger.warn('Toxic message detected:', analysis.reason);
                    if (analysis.alertParent) {
                        // אפשרות לשליחת הודעה להורה אם צריך
                    }
                }
                const score = typeof analysis.score === 'number' ? analysis.score : 0;
                const scoreChange = typeof analysis.scoreChange === 'number' ? analysis.scoreChange : 0;
                const saved = await this.messagesService.saveMessage(user.email, data.message, CHAT_ID, score);
                this.server.to(CHAT_ID).emit('receive_message', {
                    sender: saved.sender,
                    message: saved.message,
                    score,
                    CHAT_ID,
                });
                if (analysis.alertParent) {
                    this.logger.warn(`Alert for parent! Reason: ${analysis.reason}`);
                    try {
                        await axios_1.default.post('https://your-api-url.com/alert', {
                            studentEmail: user.email,
                            message: data.message,
                            chatId: CHAT_ID,
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
    return ChatGateway = _classThis;
})();
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map