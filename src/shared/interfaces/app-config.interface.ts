import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import JwtConfig from './jwt-config.interface';

interface AppConfig {
    port: number;
    env: any;
    url: string;
    defaultPassword: string;
    cron_expression: string;
    database?: TypeOrmModuleOptions;
    jwt: JwtConfig;
    allowedOrigins?: string[];
    swaggerEnabled: boolean;
    web: {
        clientUrl: string;
        adminUrl: string;
    };
    pindo?: {
        apiKey: string;
        apiUrl: string;
    };
    sendgrid?: {
        apiKey: string;
        fromEmail: string;
    };
}
export default AppConfig;
