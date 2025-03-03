import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie-parse';
import 'dotenv/config';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { CreateAnswerDto } from '../src/application/dto/create-answer.dto';
import { CreateApplicationDto } from '../src/application/dto/create-application.dto';
import { ReviewAnswersDto } from '../src/application/dto/update-answer-status.dto';
import { UpdateApplicationStatusDto } from '../src/application/dto/update-application-status.dto';
import { UpdateApplicationDto } from '../src/application/dto/update-application.dto';
import { EAnswerStatus, EApplicationStatus } from '../src/application/enums';
import { IApplication } from '../src/application/interfaces/application.interface';
import { Question } from '../src/question/entities/question.entity';
import { cookieString, initializeTestApp } from './utils';
import {
    ADMIN_EMAIL,
    DEFAULT_PASSWORD,
    TEST_COMPANY_EMAIL,
} from './utils/mockdata';

describe('ApplicationController (e2e)', () => {
    let app: INestApplication;
    let authCookie: any;
    let companyAuthCookie: any;
    let applicationId: number;
    let categoryId: number;
    let questions: Question[];
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
        const res2 = await request(app.getHttpServer())
            .post('/auth/company-login')
            .send({ username: TEST_COMPANY_EMAIL, password: DEFAULT_PASSWORD })
            .set('Content-Type', 'application/json');
        expect(res2.status).toEqual(HttpStatus.OK);
        companyAuthCookie = cookie.parse(res2.headers['set-cookie'].join(';'));
        done();
    });

    afterAll(async (done) => {
        await getConnection().close();
        await app.close();
        done();
    });

    it('should create an application', async (done) => {
        const res = await request(app.getHttpServer())
            .post(`/applications`)
            .set('cookie', cookieString(companyAuthCookie))
            .send({
                ...new CreateApplicationDto(),
                categoryId: 1,
                companyUrl: 'http://company.com',
            } as CreateApplicationDto);
        expect(res.status).toEqual(HttpStatus.CREATED);
        applicationId = res.body.payload?.id;
        categoryId = res.body.payload?.category.id;
        done();
    });
    it('admin should get all applications', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/applications`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('company should get all applications', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/applications`)
            .set('cookie', cookieString(companyAuthCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should get an application', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/applications/${applicationId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should get an application latest pending', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/applications/latest-pending`)
            .set('cookie', cookieString(companyAuthCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should update a application', async (done) => {
        const res = await request(app.getHttpServer())
            .put(`/applications/${applicationId}`)
            .set('cookie', cookieString(authCookie))
            .send({
                ...new UpdateApplicationDto(),
                companyUrl: 'https://updatedcompany.com',
            } as UpdateApplicationDto);
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });

    it('should get application questions', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/applications/questions?category=${categoryId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        questions = res.body.payload;
        done();
    });
    it('should post application answers', async (done) => {
        const res = await request(app.getHttpServer())
            .put(`/applications/${applicationId}`)
            .set('cookie', cookieString(authCookie))
            .send({
                answers: {
                    answers: [
                        ...questions.map(
                            (q) =>
                                ({
                                    questionId: q.id,
                                    responses: ['test'],
                                    attachments: ['test'],
                                } as CreateAnswerDto),
                        ),
                    ],
                },
            } as UpdateApplicationDto);
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should submit an application', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/applications/${applicationId}/submit`)
            .set('cookie', cookieString(companyAuthCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should review application answers', async (done) => {
        const application = (
            await request(app.getHttpServer())
                .get(`/applications/${applicationId}`)
                .set('cookie', cookieString(authCookie))
        ).body.payload as IApplication;

        const res = await request(app.getHttpServer())
            .patch(`/applications/${applicationId}/review`)
            .set('cookie', cookieString(authCookie))
            .send({
                answers: application.answers.map((ans) => ({
                    id: ans.id,
                    status: EAnswerStatus.ACCEPTED,
                })),
            } as ReviewAnswersDto);
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should update a application status', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/applications/${applicationId}/status`)
            .set('cookie', cookieString(authCookie))
            .send({
                status: EApplicationStatus.FIRST_STAGE_PASSED,
                setupFee: 70,
                subscriptionFee: 100,
            } as UpdateApplicationStatusDto);
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should delete an application', async (done) => {
        const res = await request(app.getHttpServer())
            .delete(`/applications/${applicationId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
});
