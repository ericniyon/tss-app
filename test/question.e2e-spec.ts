import { HttpStatus, INestApplication } from '@nestjs/common';
import * as cookie from 'cookie-parse';
import 'dotenv/config';
import * as request from 'supertest';
import { getConnection } from 'typeorm';
import { CreateQuestionDto } from '../src/question/dto/create-question.dto';
import { UpdateQuestionDto } from '../src/question/dto/update-question.dto';
import { EStatus, EType } from '../src/question/enums';
import { cookieString, initializeTestApp } from './utils';
import { ADMIN_EMAIL, DEFAULT_PASSWORD } from './utils/mockdata';

describe('QuestionController (e2e)', () => {
    let app: INestApplication;
    let authCookie: any;
    let questionId: number;
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

    it('should create a question', async (done) => {
        const res = await request(app.getHttpServer())
            .post(`/questions`)
            .set('cookie', cookieString(authCookie))
            .send({
                ...new CreateQuestionDto(),
                sectionId: 2,
                categoryIds: [1, 2, 3],
                requiresAttachments: true,
                possibleAnswers: ['One', 'Two'],
                text: 'Where are you based',
                type: EType.MULTIPLE_CHOICE,
            } as CreateQuestionDto);
        expect(res.status).toEqual(HttpStatus.CREATED);
        questionId = res.body.payload?.id;
        done();
    });
    it('should get all questions', async (done) => {
        const res = await request(app.getHttpServer())
            .get(
                `/questions?status=${EStatus.ACTIVE}&section=1&type=${EType.SINGLE_CHOICE}`,
            )
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should get one question', async (done) => {
        const res = await request(app.getHttpServer())
            .get(`/questions/${questionId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should update one question', async (done) => {
        const res = await request(app.getHttpServer())
            .put(`/questions/${questionId}`)
            .set('cookie', cookieString(authCookie))
            .send({
                ...new UpdateQuestionDto(),
                text: 'Updates?',
                categoryIds: [4],
                possibleAnswers: ['Updated'],
            } as UpdateQuestionDto);
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should add category to a question', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/questions/${questionId}/add-category?categoryId=5`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should remove category to a question', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/questions/${questionId}/remove-category?categoryId=5`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should toggle active status of a question', async (done) => {
        const res = await request(app.getHttpServer())
            .patch(`/questions/${questionId}/toggle-active`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
    it('should delete a question', async (done) => {
        const res = await request(app.getHttpServer())
            .delete(`/questions/${questionId}`)
            .set('cookie', cookieString(authCookie));
        expect(res.status).toEqual(HttpStatus.OK);
        done();
    });
});
