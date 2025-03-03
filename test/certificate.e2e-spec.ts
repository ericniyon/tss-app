import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie-parse';
import 'dotenv/config';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { UpdateCertificateStatusDto } from '../src/certificate/dto/update-certificate-status.dto';
import { ECertificateStatus } from '../src/certificate/enums';
import { cookieString, initializeTestApp } from './utils';
import { ADMIN_EMAIL, DEFAULT_PASSWORD } from './utils/mockdata';

describe('CertificateController (e2e)', () => {
    let app: INestApplication;
    let authCookie: any;
    let authCookie1: any;
    let uniqueId: string;
    let name: string;
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
    it('should get all certificates', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/certificates`)
            .set('cookie', cookieString(authCookie));
        uniqueId = JSON.parse(res.text).payload.items[0].uniqueId;
        name = JSON.parse(res.text).payload.items[0].application.applicant.name;
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should get a certificate', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/certificates/${uniqueId}/company`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });

    it('should get a certificate by applicant name', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/certificates/company-verification?name=${name}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should update a certificate', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/certificates/${uniqueId}/status`)
            .set('cookie', cookieString(authCookie))
            .send({
                status: ECertificateStatus.GRANTED,
            } as UpdateCertificateStatusDto);
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should renew certificate', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/certificates/${uniqueId}/renew`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should login applicant', async (done) => {
        const res = await request(app.getHttpServer())
            .post('/auth/company-login')
            .send({
                username: 'company@awesomity.rw',
                password: 'Login@123',
            })
            .set('Content-Type', 'application/json');
        expect(res.status).toEqual(HttpStatus.OK);
        authCookie1 = cookie.parse(res.headers['set-cookie'].join(';'));
        done();
    });
    it('should get a certificate by logged in applicant', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/certificates/company`)
            .set('cookie', cookieString(authCookie1));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
});
