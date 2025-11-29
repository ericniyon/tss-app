import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { configureSwagger, corsConfig } from './shared/config/app.config';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('port');

    app.use(helmet());
    app.use(cookieParser());
    app.setGlobalPrefix('api/v1');
    app.enableCors(corsConfig());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    if (configService.get('swaggerEnabled')) configureSwagger(app);
    await app.listen(port || 3000);
    Logger.log(`Server running on port ${port}`);
}
bootstrap();
