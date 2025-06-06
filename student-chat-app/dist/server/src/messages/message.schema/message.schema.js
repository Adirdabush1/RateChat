"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = exports.Message = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Message = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _sender_decorators;
    let _sender_initializers = [];
    let _sender_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _CHAT_ID_decorators;
    let _CHAT_ID_initializers = [];
    let _CHAT_ID_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _score_decorators;
    let _score_initializers = [];
    let _score_extraInitializers = [];
    let _mood_decorators;
    let _mood_initializers = [];
    let _mood_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _chatId_decorators;
    let _chatId_initializers = [];
    let _chatId_extraInitializers = [];
    var Message = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _sender_decorators = [(0, mongoose_1.Prop)({ required: true })];
            _message_decorators = [(0, mongoose_1.Prop)({ required: true })];
            _CHAT_ID_decorators = [(0, mongoose_1.Prop)({ required: true })];
            _createdAt_decorators = [(0, mongoose_1.Prop)({ default: Date.now })];
            _score_decorators = [(0, mongoose_1.Prop)({ required: false, default: 0 })];
            _mood_decorators = [(0, mongoose_1.Prop)({ required: false })];
            _userId_decorators = [(0, mongoose_1.Prop)({ required: false })];
            _content_decorators = [(0, mongoose_1.Prop)({ required: false })];
            _chatId_decorators = [(0, mongoose_1.Prop)({ required: false })];
            __esDecorate(null, null, _sender_decorators, { kind: "field", name: "sender", static: false, private: false, access: { has: obj => "sender" in obj, get: obj => obj.sender, set: (obj, value) => { obj.sender = value; } }, metadata: _metadata }, _sender_initializers, _sender_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _CHAT_ID_decorators, { kind: "field", name: "CHAT_ID", static: false, private: false, access: { has: obj => "CHAT_ID" in obj, get: obj => obj.CHAT_ID, set: (obj, value) => { obj.CHAT_ID = value; } }, metadata: _metadata }, _CHAT_ID_initializers, _CHAT_ID_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _score_decorators, { kind: "field", name: "score", static: false, private: false, access: { has: obj => "score" in obj, get: obj => obj.score, set: (obj, value) => { obj.score = value; } }, metadata: _metadata }, _score_initializers, _score_extraInitializers);
            __esDecorate(null, null, _mood_decorators, { kind: "field", name: "mood", static: false, private: false, access: { has: obj => "mood" in obj, get: obj => obj.mood, set: (obj, value) => { obj.mood = value; } }, metadata: _metadata }, _mood_initializers, _mood_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _chatId_decorators, { kind: "field", name: "chatId", static: false, private: false, access: { has: obj => "chatId" in obj, get: obj => obj.chatId, set: (obj, value) => { obj.chatId = value; } }, metadata: _metadata }, _chatId_initializers, _chatId_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Message = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        sender = __runInitializers(this, _sender_initializers, void 0);
        text = __runInitializers(this, _sender_extraInitializers);
        message = __runInitializers(this, _message_initializers, void 0);
        CHAT_ID = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _CHAT_ID_initializers, void 0));
        createdAt = (__runInitializers(this, _CHAT_ID_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
        score = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _score_initializers, void 0));
        // שדות חסרים:
        mood = (__runInitializers(this, _score_extraInitializers), __runInitializers(this, _mood_initializers, void 0));
        userId = (__runInitializers(this, _mood_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
        content = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _content_initializers, void 0));
        chatId = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _chatId_initializers, void 0));
        constructor() {
            __runInitializers(this, _chatId_extraInitializers);
        }
    };
    return Message = _classThis;
})();
exports.Message = Message;
exports.MessageSchema = mongoose_1.SchemaFactory.createForClass(Message);
//# sourceMappingURL=message.schema.js.map