"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();
exports.default = mm + '/' + dd + '/' + yyyy;
//# sourceMappingURL=currentDate.js.map