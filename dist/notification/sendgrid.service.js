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
exports.SendGridService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const SendGrid = require("@sendgrid/mail");
require("dotenv/config");
let SendGridService = class SendGridService {
    constructor(configService) {
        this.configService = configService;
        SendGrid.setApiKey(this.configService.get('sendgrid').apiKey);
    }
    async send(mail) {
        try {
            return await SendGrid.send(mail);
        }
        catch (error) {
            common_1.Logger.error(error);
        }
    }
    async sendMultiple(mail) {
        try {
            return await SendGrid.sendMultiple(mail);
        }
        catch (error) {
            common_1.Logger.error(error);
        }
    }
};
SendGridService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SendGridService);
exports.SendGridService = SendGridService;
//# sourceMappingURL=sendgrid.service.js.map