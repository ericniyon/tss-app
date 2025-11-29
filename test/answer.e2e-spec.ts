import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie-parse';
import 'dotenv/config';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { CreateStandaloneAnswerDto } from '../src/application/dto/create-answer.dto';
import { CreateApplicationDto } from '../src/application/dto/create-application.dto';
import { EAnswerStatus } from '../src/application/enums';
import { cookieString, initializeTestApp } from './utils';
import {
    ADMIN_EMAIL,
    DEFAULT_PASSWORD,
    TEST_COMPANY_EMAIL,
} from './utils/mockdata';

describe('AnswerController (e2e)', () => {
    let app: INestApplication;
    let authCookie: any;
    let companyAuthCookie: any;
    let applicationId: number;
    let questionId: number;
    let answerId: number;

    beforeAll(async () => {
        app = await initializeTestApp();
        await app.init();
    });

    beforeAll(async (done) => {
        // Login as admin
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: ADMIN_EMAIL, password: DEFAULT_PASSWORD })
            .set('Content-Type', 'application/json');
        authCookie = cookie.parse(res.headers['set-cookie'].join(';'));

        // Login as company
        const res2 = await request(app.getHttpServer())
            .post('/auth/company-login')
            .send({ username: TEST_COMPANY_EMAIL, password: DEFAULT_PASSWORD })
            .set('Content-Type', 'application/json');
        expect(res2.status).toEqual(HttpStatus.OK);
        companyAuthCookie = cookie.parse(res2.headers['set-cookie'].join(';'));
        done();
    });

    beforeAll(async (done) => {
        // Create an application for testing
        const res = await request(app.getHttpServer())
            .post(`/applications`)
            .set('cookie', cookieString(companyAuthCookie))
            .send({
                ...new CreateApplicationDto(),
                categoryId: 1,
                companyUrl: 'http://test-answer-company.com',
            } as CreateApplicationDto);
        expect(res.status).toEqual(HttpStatus.CREATED);
        applicationId = res.body.results?.id || res.body.payload?.id;

        // Get questions for the category
        const questionsRes = await request(app.getHttpServer())
            .get(`/applications/questions?category=1`)
            .set('cookie', cookieString(authCookie));
        expect(questionsRes.status).toEqual(HttpStatus.OK);
        const questions = questionsRes.body.results || questionsRes.body.payload;
        if (questions && questions.length > 0) {
            questionId = questions[0].id;
        }
        done();
    });

    afterAll(async (done) => {
        await getConnection().close();
        await app.close();
        done();
    });

    it('should create an answer', async (done) => {
        const createAnswerDto: CreateStandaloneAnswerDto = {
            applicationId,
            questionId,
            questionText: 'Test question text',
            responses: ['Test response 1', 'Test response 2'],
            attachments: ['attachment1.jpg', 'attachment2.jpg'],
            status: EAnswerStatus.NONE,
        };

        const res = await request(app.getHttpServer())
            .post(`/answers`)
            .set('cookie', cookieString(companyAuthCookie))
            .send(createAnswerDto);

        expect(res.status).toEqual(HttpStatus.CREATED);
        expect(res.body.results || res.body.payload).toBeDefined();
        const answer = res.body.results || res.body.payload;
        expect(answer.id).toBeDefined();
        expect(answer.questionText).toEqual('Test question text');
        expect(answer.responses).toEqual(['Test response 1', 'Test response 2']);
        expect(answer.attachments).toEqual([
            'attachment1.jpg',
            'attachment2.jpg',
        ]);
        expect(answer.status).toEqual(EAnswerStatus.NONE);
        expect(answer.application).toBeDefined();
        expect(answer.question).toBeDefined();
        answerId = answer.id;
        done();
    });

    it('should create an answer with nullable status', async (done) => {
        // Get a different question to avoid duplicate
        const questionsRes = await request(app.getHttpServer())
            .get(`/applications/questions?category=1`)
            .set('cookie', cookieString(authCookie));
        const questions = questionsRes.body.results || questionsRes.body.payload;
        const differentQuestion = questions.find((q: any) => q.id !== questionId);

        if (differentQuestion) {
            const createAnswerDto: CreateStandaloneAnswerDto = {
                applicationId,
                questionId: differentQuestion.id,
                questionText: 'Test question with null status',
                responses: ['Test response'],
                status: null,
            };

            const res = await request(app.getHttpServer())
                .post(`/answers`)
                .set('cookie', cookieString(companyAuthCookie))
                .send(createAnswerDto);

            expect(res.status).toEqual(HttpStatus.CREATED);
            const answer = res.body.results || res.body.payload;
            expect(answer.status).toBeNull();
        }
        done();
    });

    it('should create an answer without status field', async (done) => {
        // Get a different question to avoid duplicate
        const questionsRes = await request(app.getHttpServer())
            .get(`/applications/questions?category=1`)
            .set('cookie', cookieString(authCookie));
        const questions = questionsRes.body.results || questionsRes.body.payload;
        const differentQuestion = questions.find(
            (q: any) => q.id !== questionId && q.id !== answerId,
        );

        if (differentQuestion) {
            const createAnswerDto = {
                applicationId,
                questionId: differentQuestion.id,
                questionText: 'Test question without status',
                responses: ['Test response'],
                // status is omitted
            };

            const res = await request(app.getHttpServer())
                .post(`/answers`)
                .set('cookie', cookieString(companyAuthCookie))
                .send(createAnswerDto);

            expect(res.status).toEqual(HttpStatus.CREATED);
            const answer = res.body.results || res.body.payload;
            expect(answer).toBeDefined();
        }
        done();
    });

    it('should fail to create duplicate answer', async (done) => {
        const createAnswerDto: CreateStandaloneAnswerDto = {
            applicationId,
            questionId,
            questionText: 'Duplicate test',
            responses: ['Test response'],
        };

        const res = await request(app.getHttpServer())
            .post(`/answers`)
            .set('cookie', cookieString(companyAuthCookie))
            .send(createAnswerDto);

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.body.message).toContain('already exists');
        done();
    });

    it('should fail with invalid applicationId', async (done) => {
        const createAnswerDto: CreateStandaloneAnswerDto = {
            applicationId: 99999,
            questionId,
            questionText: 'Test question',
            responses: ['Test response'],
        };

        const res = await request(app.getHttpServer())
            .post(`/answers`)
            .set('cookie', cookieString(companyAuthCookie))
            .send(createAnswerDto);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
        expect(res.body.message).toContain('Application');
        done();
    });

    it('should fail with invalid questionId', async (done) => {
        const createAnswerDto: CreateStandaloneAnswerDto = {
            applicationId,
            questionId: 99999,
            questionText: 'Test question',
            responses: ['Test response'],
        };

        const res = await request(app.getHttpServer())
            .post(`/answers`)
            .set('cookie', cookieString(companyAuthCookie))
            .send(createAnswerDto);

        expect(res.status).toEqual(HttpStatus.NOT_FOUND);
        expect(res.body.message).toContain('Question');
        done();
    });

    it('should fail without authentication', async (done) => {
        const createAnswerDto: CreateStandaloneAnswerDto = {
            applicationId,
            questionId,
            questionText: 'Test question',
            responses: ['Test response'],
        };

        const res = await request(app.getHttpServer())
            .post(`/answers`)
            .send(createAnswerDto);

        expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
        done();
    });
});

