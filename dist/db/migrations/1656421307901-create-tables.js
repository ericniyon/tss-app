"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables1656497508370 = void 0;
class createTables1656497508370 {
    constructor() {
        this.name = 'createTables1656497508370';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sections" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "tips" text NOT NULL, "active" boolean NOT NULL DEFAULT true,  "readonly" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f9749dd3bffd880a497d007e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "text" character varying NOT NULL, "type" character varying NOT NULL, "numberOfAttachments" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "possibleAnswers" text array, "hasBeenAsked" boolean NOT NULL DEFAULT false, "sectionId" integer, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_otp" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "otp" character varying NOT NULL, "otp_type" character varying NOT NULL, "expiration_time" TIMESTAMP NOT NULL, "sent_to" character varying NOT NULL DEFAULT 'phone', "userId" integer, CONSTRAINT "PK_06c70acc09e7cb64b282d37e139" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "type" character varying NOT NULL, "subject" character varying NOT NULL, "message" text NOT NULL, "targetApplicationStatus" character varying, "targetPlatform" character varying, "targetCategoryId" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying, "name" character varying NOT NULL, "phone" character varying, "verified" boolean DEFAULT false, "activated" boolean NOT NULL DEFAULT true, "role" character varying NOT NULL DEFAULT 'COMPANY', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "applications" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "companyUrl" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "completed" boolean NOT NULL DEFAULT false, "businessPlatform" character varying, "setupFee" integer, "subscriptionFee" integer, "submittedAt" TIMESTAMP, "applicantId" integer, "categoryId" integer, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "questionText" character varying NOT NULL, "attachments" text array NOT NULL DEFAULT '{}', "responses" text array NOT NULL DEFAULT '{}', "status" character varying, "feedback" text, "applicationId" integer, "questionId" integer, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "certificates" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "uniqueId" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING_PAYMENT', "expirationDate" TIMESTAMP, "applicationId" integer, CONSTRAINT "REL_4ed0541b89cc021ab079944d83" UNIQUE ("applicationId"), CONSTRAINT "PK_e4c7e31e2144300bea7d89eb165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions_categories" ("questionsId" integer NOT NULL, "categoriesId" integer NOT NULL, CONSTRAINT "PK_cbb0bdc844df6ab882662d6b8a8" PRIMARY KEY ("questionsId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_572deb4045e08510a274e0c604" ON "questions_categories" ("questionsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_441e3eb944161ffdc97a7f466b" ON "questions_categories" ("categoriesId") `);
        await queryRunner.query(`CREATE TABLE "notifications_target_users_users" ("notificationsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_7c1604f83e414d462ccd44aa91c" PRIMARY KEY ("notificationsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e617f535bfd04858894db4588d" ON "notifications_target_users_users" ("notificationsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e4eee4ad471edbf2adadc71eab" ON "notifications_target_users_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "applications_assignees_users" ("applicationsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_1da749e5a1dbe6d5cc7c6a0176e" PRIMARY KEY ("applicationsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8895e8e33075dcada70b72986b" ON "applications_assignees_users" ("applicationsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c17e7d452a0ff7fd7dbcf0d9e8" ON "applications_assignees_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "certificates_assignees_users" ("certificatesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_cc39c2225ef7889dc70bd8140a4" PRIMARY KEY ("certificatesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_55def239ef067a6c4f43bac3ef" ON "certificates_assignees_users" ("certificatesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7aec632a910f536b69ea328e75" ON "certificates_assignees_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_8f1e03cfa6eea6e8472e3c250db" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auth_otp" ADD CONSTRAINT "FK_1cf9ff4ed6b3d4c6225d7bff9ae" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_f4ad81d6d2ba863cb63d6644114" FOREIGN KEY ("targetCategoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_909867e55cc94e350ae38383cb5" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_e8a06d416399a4c08b4a86574bb" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_4e0b56cafc487779473b71a919d" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certificates" ADD CONSTRAINT "FK_4ed0541b89cc021ab079944d832" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions_categories" ADD CONSTRAINT "FK_572deb4045e08510a274e0c604d" FOREIGN KEY ("questionsId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "questions_categories" ADD CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications_target_users_users" ADD CONSTRAINT "FK_e617f535bfd04858894db4588db" FOREIGN KEY ("notificationsId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "notifications_target_users_users" ADD CONSTRAINT "FK_e4eee4ad471edbf2adadc71eab7" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications_assignees_users" ADD CONSTRAINT "FK_8895e8e33075dcada70b72986b3" FOREIGN KEY ("applicationsId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "applications_assignees_users" ADD CONSTRAINT "FK_c17e7d452a0ff7fd7dbcf0d9e81" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "certificates_assignees_users" ADD CONSTRAINT "FK_55def239ef067a6c4f43bac3efa" FOREIGN KEY ("certificatesId") REFERENCES "certificates"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "certificates_assignees_users" ADD CONSTRAINT "FK_7aec632a910f536b69ea328e75e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "certificates_assignees_users" DROP CONSTRAINT "FK_7aec632a910f536b69ea328e75e"`);
        await queryRunner.query(`ALTER TABLE "certificates_assignees_users" DROP CONSTRAINT "FK_55def239ef067a6c4f43bac3efa"`);
        await queryRunner.query(`ALTER TABLE "applications_assignees_users" DROP CONSTRAINT "FK_c17e7d452a0ff7fd7dbcf0d9e81"`);
        await queryRunner.query(`ALTER TABLE "applications_assignees_users" DROP CONSTRAINT "FK_8895e8e33075dcada70b72986b3"`);
        await queryRunner.query(`ALTER TABLE "notifications_target_users_users" DROP CONSTRAINT "FK_e4eee4ad471edbf2adadc71eab7"`);
        await queryRunner.query(`ALTER TABLE "notifications_target_users_users" DROP CONSTRAINT "FK_e617f535bfd04858894db4588db"`);
        await queryRunner.query(`ALTER TABLE "questions_categories" DROP CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba"`);
        await queryRunner.query(`ALTER TABLE "questions_categories" DROP CONSTRAINT "FK_572deb4045e08510a274e0c604d"`);
        await queryRunner.query(`ALTER TABLE "certificates" DROP CONSTRAINT "FK_4ed0541b89cc021ab079944d832"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_4e0b56cafc487779473b71a919d"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_e8a06d416399a4c08b4a86574bb"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_909867e55cc94e350ae38383cb5"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_f4ad81d6d2ba863cb63d6644114"`);
        await queryRunner.query(`ALTER TABLE "auth_otp" DROP CONSTRAINT "FK_1cf9ff4ed6b3d4c6225d7bff9ae"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_8f1e03cfa6eea6e8472e3c250db"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7aec632a910f536b69ea328e75"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_55def239ef067a6c4f43bac3ef"`);
        await queryRunner.query(`DROP TABLE "certificates_assignees_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c17e7d452a0ff7fd7dbcf0d9e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8895e8e33075dcada70b72986b"`);
        await queryRunner.query(`DROP TABLE "applications_assignees_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4eee4ad471edbf2adadc71eab"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e617f535bfd04858894db4588d"`);
        await queryRunner.query(`DROP TABLE "notifications_target_users_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_441e3eb944161ffdc97a7f466b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_572deb4045e08510a274e0c604"`);
        await queryRunner.query(`DROP TABLE "questions_categories"`);
        await queryRunner.query(`DROP TABLE "certificates"`);
        await queryRunner.query(`DROP TABLE "answers"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "auth_otp"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "sections"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }
}
exports.createTables1656497508370 = createTables1656497508370;
//# sourceMappingURL=1656421307901-create-tables.js.map