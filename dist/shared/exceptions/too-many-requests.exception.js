"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsException = void 0;
const common_1 = require("@nestjs/common");
class TooManyRequestsException extends common_1.HttpException {
    constructor(message) {
        super({
            statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
            message: message || 'Too many requests',
            error: 'Too many requests',
        }, common_1.HttpStatus.TOO_MANY_REQUESTS);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
//# sourceMappingURL=too-many-requests.exception.js.map