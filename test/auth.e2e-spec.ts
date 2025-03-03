import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie-parse';
import 'dotenv/config';
import * as request from 'supertest';
import { getConnection, getRepository, Repository } from 'typeorm';
import { AuthOtp } from '../src/auth/entities/auth-otp.entity';
import { cookieString, initializeTestApp } from './utils';
import { ADMIN_EMAIL, DEFAULT_PASSWORD } from './utils/mockdata';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let otpRepo: Repository<AuthOtp>;
    let authCookie: any;
    beforeAll(async () => {
        app = await initializeTestApp();
        await app.init();
    });

    afterAll(async (done) => {
        await getConnection().close();
        await app.close();
        done();
    });

    it('should register a user', async (done) => {
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                name: 'Brian Gitego',
                email: 'gbrian@gmail.com',
                phone: '+250780000001',
                password: 'Pass@123',
            })
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(HttpStatus.CREATED);
        done();
    });

    it('should login the admin', async (done) => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: ADMIN_EMAIL, password: DEFAULT_PASSWORD })
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(HttpStatus.OK);
        authCookie = cookie.parse(res.headers['set-cookie'].join(';'));
        done();
    });

    it('should not verify a wrong code', async (done) => {
        const res = await request(app.getHttpServer()).get(
            '/auth/verify?code=123456',
        );
        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
        done();
    });

    it('should verify a code', async (done) => {
        otpRepo = getRepository(AuthOtp);
        const code = (await otpRepo.find())[0].otp;
        const res = await request(app.getHttpServer()).get(
            `/auth/verify?code=${code}`,
        );
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });

    it('should get profile', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/auth/get-profile`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
});
