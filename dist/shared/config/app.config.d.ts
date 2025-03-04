import { INestApplication } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import AppConfig from '../interfaces/app-config.interface';
export declare const commonConfig: () => AppConfig;
export declare const runtimeConfig: () => AppConfig;
export declare const testingConfig: () => AppConfig;
export declare function configureSwagger(app: INestApplication): void;
export declare function corsConfig(): CorsOptions;
