import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { AppController } from '../../src/app.controller';
import { AppModule } from '../../src/app.module';
import { AppService } from '../../src/app.service';

export const initializeTestApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
        providers: [AppService],
        controllers: [AppController],
    }).compile();
    const app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    return app;
};

export const cookieString = (authCookie: any) =>
    `tss_jwt=${authCookie['tss_jwt']}; tss_refresh_jwt=${authCookie['tss_refresh_jwt']}`;
