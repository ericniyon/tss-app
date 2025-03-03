import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie-parse';
import 'dotenv/config';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { Roles } from '../src/shared/enums/roles.enum';
import { CreateUserAccountDto } from '../src/users/dto/create-user-account.dto';
import { UpdateUserAccountDto } from '../src/users/dto/update-user-account.dto';
import { cookieString, initializeTestApp } from './utils';
import { ADMIN_EMAIL, DEFAULT_PASSWORD } from './utils/mockdata';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let authCookie: any;
    let userId: number;
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

    it('should create a user', async (done) => {
        const res = await request(app.getHttpServer())
            .post(`/users`)
            .set('cookie', cookieString(authCookie))
            .send({
                ...new CreateUserAccountDto(),
                email: 'test@gmail.com',
                name: 'Test User',
                role: Roles.DBI_EXPERT,
            } as CreateUserAccountDto);
        expect(res.status).toEqual(HttpStatus.CREATED);
        userId = res.body.payload?.id;
        done();
    });
    it('should get all users', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/users`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should get all experts', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/users/experts`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should activate a user', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/users/activate/${userId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should update one user', async (done) => {
        const res = await request(app.getHttpServer())
            .put(`/users/${userId}`)
            .set('cookie', cookieString(authCookie))
            .send({
                ...new UpdateUserAccountDto(),
                name: 'New Name',
            } as UpdateUserAccountDto);
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should delete a user', async (done) => {
        const res = await request(app.getHttpServer())
            .delete(`/users/${userId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
});
