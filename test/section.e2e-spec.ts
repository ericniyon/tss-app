import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie-parse';
import 'dotenv/config';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { CreateSectionDto } from '../src/section/dto/create-section.dto';
import { UpdateSectionDto } from '../src/section/dto/update-section.dto';
import { cookieString, initializeTestApp } from './utils';
import { ADMIN_EMAIL, DEFAULT_PASSWORD } from './utils/mockdata';

describe('SectionController (e2e)', () => {
    let app: INestApplication;
    let authCookie: any;
    let sectionId: number;
    beforeAll(async () => {
        app = await initializeTestApp();
        await app.init();
    });

    beforeAll(async (done) => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: ADMIN_EMAIL, password: DEFAULT_PASSWORD })
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(HttpStatus.OK);
        authCookie = cookie.parse(res.headers['set-cookie'].join(';'));
        done();
    });

    afterAll(async (done) => {
        await getConnection().close();
        await app.close();
        done();
    });

    it('should create a section', async (done) => {
        const res = await request(app.getHttpServer())
            .post(`/sections`)
            .set('cookie', cookieString(authCookie))
            .send({
                ...new CreateSectionDto(),
                title: 'Test',
                tips: 'Test tipds',
            });
        expect(res.status).toEqual(HttpStatus.CREATED);
        sectionId = res.body.payload?.id;
        done();
    });
    it('should get all sections', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/sections`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should get a section', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/sections/${sectionId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should update a section', async (done) => {
        const res = await request(app.getHttpServer())
            .put(`/sections/${sectionId}`)
            .set('cookie', cookieString(authCookie))
            .send({ ...new UpdateSectionDto(), title: 'Test section updated' });
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should update a section active status', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/sections/${sectionId}/toggle-active`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });

    it('should not get a missing section', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/sections/0`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
        done();
    });
});
