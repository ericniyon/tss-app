"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../guards/jwt.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("./roles.decorator");
function Auth(...roles) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiCookieAuth)(), (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, roles_guard_1.RolesGuard), (0, roles_decorator_1.Role)(...roles));
}
exports.Auth = Auth;
//# sourceMappingURL=auth.decorator.js.map