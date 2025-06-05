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
exports.AppModule = exports.MongoConnectionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const path_1 = require("path");
const messages_module_1 = require("./messages/messages.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const alerts_service_1 = require("./alerts/alerts.service");
const chat_gateway_1 = require("./chat.gateway");
const parent_module_1 = require("./perent/parent.module");
let MongoConnectionService = class MongoConnectionService {
    connection;
    constructor(connection) {
        this.connection = connection;
    }
    onModuleInit() {
        this.connection.once('open', () => {
            console.log('✅ MongoDB connection established successfully!');
        });
        this.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
    }
};
exports.MongoConnectionService = MongoConnectionService;
exports.MongoConnectionService = MongoConnectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], MongoConnectionService);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: (0, path_1.join)(__dirname, '..', '.env'),
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            messages_module_1.MessagesModule,
            parent_module_1.ParentModule,
        ],
        providers: [chat_gateway_1.ChatGateway, alerts_service_1.AlertsService, MongoConnectionService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map