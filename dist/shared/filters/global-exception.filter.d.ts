import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
    formatError(error: string | Record<string, unknown> | any): any;
}
