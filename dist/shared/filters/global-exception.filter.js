"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const TAG = 'GlobalExceptionFilter';
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const isHttp = exception instanceof common_1.HttpException;
        const status = isHttp
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = isHttp
            ? exception.getResponse()
            : exception.message;
        const error = typeof response === 'string'
            ? { message: exceptionResponse }
            : isHttp
                ? exceptionResponse
                : { message: exceptionResponse };
        common_1.Logger.error(`${request.url} ${request.method}`, exception.stack, TAG);
        response.status(status).json(Object.assign(Object.assign({}, this.formatError(error)), { timestamp: new Date().toISOString() }));
    }
    formatError(error) {
        if (error.message && !Array.isArray(error.message)) {
            error.message = [error.message];
        }
        return error;
    }
};
GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
exports.GlobalExceptionFilter = GlobalExceptionFilter;
//# sourceMappingURL=global-exception.filter.js.map