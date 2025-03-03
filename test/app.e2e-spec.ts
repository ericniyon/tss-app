import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { initializeTestApp } from './utils';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await initializeTestApp();
        await app.init();
    });

    afterAll(async (done) => {
        await getConnection().close();
        await app.close();
        done();
    });

    it('Should get welcome message (GET) /api', async (done) => {
        const res = await request(app.getHttpServer()).get('/');
        expect(res.status).toEqual(200);
        done();
    });
});
