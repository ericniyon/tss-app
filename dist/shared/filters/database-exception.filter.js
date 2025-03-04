"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const postgres_error_code_enum_1 = require("../enums/postgres-error-code.enum");
let DatabaseExceptionFilter = class DatabaseExceptionFilter {
    catch(exception, host) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        const { url } = request;
        const { message, detail, code } = exception;
        const status = common_1.HttpStatus.CONFLICT;
        const errorMessage = this.getMessageByCode(code, message, detail);
        const errorResponse = {
            statusCode: status,
            path: url,
            message: errorMessage,
            error: detail,
            timestamp: new Date().toISOString(),
        };
        common_1.Logger.error(`${request.url} ${request.method}`, exception.stack, 'DatabaseExceptionFilter');
        response.status(status).json(errorResponse);
    }
    getMessageByCode(code, message, detail) {
        switch (code) {
            case postgres_error_code_enum_1.PostgresErrorCode.UniqueViolation:
                const msg = this.getConstraintKeyMessage(detail);
                return [msg];
            default:
                return message;
        }
    }
    getConstraintKeyMessage(message) {
        try {
            const regExp = /\(([^)]+)\)/;
            const matches = regExp.exec(message);
            const key = matches[1];
            if (key) {
                const n = message.lastIndexOf(')');
                const explanation = message.substring(n + 1);
                return `${key}${explanation}`;
            }
            else {
                return message;
            }
        }
        catch (error) {
            common_1.Logger.error(`Could not format database exception message`, error, 'DatabaseExceptionFilter');
            return message;
        }
    }
};
DatabaseExceptionFilter = __decorate([
    (0, common_1.Catch)(typeorm_1.QueryFailedError)
], DatabaseExceptionFilter);
exports.DatabaseExceptionFilter = DatabaseExceptionFilter;
//# sourceMappingURL=database-exception.filter.js.map