"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdGenerator = void 0;
const IdGenerator = (name) => {
    const str = name.split(' ');
    const newArr = str.map((el) => el.charAt(0));
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
    return `${newArr.join('')}-${randomNumber}`;
};
exports.IdGenerator = IdGenerator;
//# sourceMappingURL=company-id-generator.js.map