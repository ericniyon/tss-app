import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GenericResponse } from '../interfaces/generic-response.interface';
export declare class ResponseTransformInterceptor<T> implements NestInterceptor<T, GenericResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
