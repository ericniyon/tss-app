import { Readable } from 'stream';

/**
 * Create Readable Stream
 * @param buffer
 */
export const createReadableStream = (buffer: Buffer): Readable => {
    const stream: Readable = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};
