"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentModule = void 0;
const common_1 = require("@nestjs/common");
const parent_controller_1 = require("./parent.controller");
const perent_service_1 = require("./perent.service");
const users_module_1 = require("../users/users.module");
const messages_module_1 = require("../messages/messages.module");
const mailer_service_1 = require("../mailer/mailer.service");
let ParentModule = class ParentModule {
};
exports.ParentModule = ParentModule;
exports.ParentModule = ParentModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, messages_module_1.MessagesModule],
        controllers: [parent_controller_1.ParentController],
        providers: [perent_service_1.ParentService, mailer_service_1.MailerService],
        exports: [perent_service_1.ParentService]
    })
], ParentModule);
//# sourceMappingURL=parent.module.js.map