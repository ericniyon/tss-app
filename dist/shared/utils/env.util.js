"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRunningInDevelopment = void 0;
require("dotenv/config");
const isRunningInDevelopment = () => process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging';
exports.isRunningInDevelopment = isRunningInDevelopment;
//# sourceMappingURL=env.util.js.map