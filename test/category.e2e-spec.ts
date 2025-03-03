import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie-parse';
import 'dotenv/config';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { CreateCategoryDto } from '../src/category/dto/create-category.dto';
import { UpdateCategoryDto } from '../src/category/dto/update-category.dto';
import { cookieString, initializeTestApp } from './utils';
import { ADMIN_EMAIL, DEFAULT_PASSWORD } from './utils/mockdata';

describe('CategoryController (e2e)', () => {
    let app: INestApplication;
    let authCookie: any;
    let categoryId: number;
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

    it('should create a category', async (done) => {
        const res = await request(app.getHttpServer())
            .post(`/categories`)
            .set('cookie', cookieString(authCookie))
            .send({ ...new CreateCategoryDto(), name: 'Test' });
        expect(res.status).toEqual(HttpStatus.CREATED);
        categoryId = res.body.payload?.id;
        done();
    });
    it('should get all categories', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/categories`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should get a category', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/categories/${categoryId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should update a category', async (done) => {
        const res = await request(app.getHttpServer())
            .put(`/categories/${categoryId}`)
            .set('cookie', cookieString(authCookie))
            .send({ ...new UpdateCategoryDto(), name: 'Test updated' });
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should update a category active status', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/categories/${categoryId}/toggle-active`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should delete a category', async (done) => {
        const res = await request(app.getHttpServer())
            .delete(`/categories/${categoryId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });

    it('should not get a missing category', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/categories/${categoryId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
        done();
    });
});
