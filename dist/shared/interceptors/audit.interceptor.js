"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let AuditInterceptor = class AuditInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const now = Date.now();
        common_1.Logger.log(`User is attempting to make a request to: ${url} ${method}`, context.getClass().name);
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - now;
            common_1.Logger.log(`User successfully made a request to:${url} ${method} ${duration}ms`, context.getClass().name);
        }));
    }
};
AuditInterceptor = __decorate([
    (0, common_1.Injectable)()
], AuditInterceptor);
exports.AuditInterceptor = AuditInterceptor;
//# sourceMappingURL=audit.interceptor.js.map