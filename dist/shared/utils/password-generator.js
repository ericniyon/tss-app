"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
const allowed = {
    uppers: 'QWERTYUIOPASDFGHJKLZXCVBNM',
    lowers: 'qwertyuiopasdfghjklzxcvbnm',
    numbers: '1234567890',
    symbols: '!@#$%^&*',
};
const getRandomCharFromString = (str) => str.charAt(Math.floor(Math.random() * str.length));
const generatePassword = (length = 8) => {
    let pwd = '';
    pwd += getRandomCharFromString(allowed.uppers);
    pwd += getRandomCharFromString(allowed.lowers);
    pwd += getRandomCharFromString(allowed.numbers);
    pwd += getRandomCharFromString(allowed.symbols);
    for (let i = pwd.length; i < length; i++)
        pwd += getRandomCharFromString(Object.values(allowed).join(''));
    return pwd;
};
exports.generatePassword = generatePassword;
//# sourceMappingURL=password-generator.js.map