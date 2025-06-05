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
exports.AlertsController = void 0;
const common_1 = require("@nestjs/common");
const alerts_service_1 = require("./alerts.service");
const create_alert_dto_1 = require("./dto/create-alert.dto");
let AlertsController = class AlertsController {
    alertsService;
    logger = new common_1.Logger('AlertsController');
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
    async create(alert) {
        this.logger.warn(`⚠️ You received an alert from the chat system`);
        this.logger.log(`Student: ${alert.studentEmail}`);
        this.logger.log(`Message: ${alert.message}`);
        this.logger.log(`Reason: ${alert.reason}`);
        this.logger.log(`Chat ID: ${alert.chatId}`);
        this.logger.log(`Timestamp: ${alert.timestamp}`);
        return { status: 'ok' };
    }
};
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_alert_dto_1.CreateAlertDto]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "create", null);
exports.AlertsController = AlertsController = __decorate([
    (0, common_1.Controller)('alert'),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map