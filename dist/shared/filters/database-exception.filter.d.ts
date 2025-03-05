import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { TypeOrmException } from '../exceptions/typeorm-exception.exception';
export declare class DatabaseExceptionFilter<T extends TypeOrmException> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost): void;
    getMessageByCode(code: string, message: string, detail?: string): string | string[];
    getConstraintKeyMessage(message: string): string;
}
