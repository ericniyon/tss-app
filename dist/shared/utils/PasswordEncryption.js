"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordEncryption = void 0;
const bcrypt = require("bcrypt");
class PasswordEncryption {
    async hashPassword(pass) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(pass, salt);
        return hashedPassword;
    }
    async comparePassword(newPassword, currPassword) {
        const result = await bcrypt.compare(newPassword, currPassword);
        return result;
    }
}
exports.PasswordEncryption = PasswordEncryption;
//# sourceMappingURL=PasswordEncryption.js.map