import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie-parse';
import 'dotenv/config';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { EApplicationStatus, EPlatform } from '../src/application/enums';
import { CreateNotificationDto } from '../src/notification/dto/create-notification.dto';
import { ENotificationType } from '../src/notification/enums';
import { cookieString, initializeTestApp } from './utils';
import { ADMIN_EMAIL, DEFAULT_PASSWORD } from './utils/mockdata';

describe('NotificationController (e2e)', () => {
    let app: INestApplication;
    let authCookie: any;
    beforeAll(async () => {
        app = await initializeTestApp();
        await app.init();
    });

    beforeAll(async (done) => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: ADMIN_EMAIL, password: DEFAULT_PASSWORD })
            .set('Content-Type', 'application/json');
        authCookie = cookie.parse(res.headers['set-cookie'].join(';'));
        done();
    });

    afterAll(async (done) => {
        await getConnection().close();
        await app.close();
        done();
    });

    it('should create a notification', async (done) => {
        const res = await request(app.getHttpServer())
            .post(`/notifications`)
            .set('cookie', cookieString(authCookie))
            .send({
                ...new CreateNotificationDto(),
                type: ENotificationType.EMAIL,
                message: 'Testing message',
                subject: 'Testing subject',
                targetApplicationStatus: EApplicationStatus.APPROVED,
                targetPlatform: EPlatform.WEBSITE,
            } as CreateNotificationDto);
        expect(res.status).toEqual(HttpStatus.CREATED);
        done();
    });
    it('should throw not found on create a notification with invalid target users', async (done) => {
        const res = await request(app.getHttpServer())
            .post(`/notifications`)
            .set('cookie', cookieString(authCookie))
            .send({
                ...new CreateNotificationDto(),
                type: ENotificationType.EMAIL,
                message: 'Testing message',
                subject: 'Testing subject',
                targetUsers: [0],
            } as CreateNotificationDto);
        console.log(res.body);
        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
        done();
    });
});
