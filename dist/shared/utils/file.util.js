"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReadableStream = void 0;
const stream_1 = require("stream");
const createReadableStream = (buffer) => {
    const stream = new stream_1.Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};
exports.createReadableStream = createReadableStream;
//# sourceMappingURL=file.util.js.map