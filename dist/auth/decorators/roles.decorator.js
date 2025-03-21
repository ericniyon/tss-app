"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ROLES_KEY = 'roles';
const Role = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Role = Role;
//# sourceMappingURL=roles.decorator.js.map