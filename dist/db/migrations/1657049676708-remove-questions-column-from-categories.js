"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeQuestionsColumnFromCategories1657049676708 = void 0;
class removeQuestionsColumnFromCategories1657049676708 {
    constructor() {
        this.name = 'removeQuestionsColumnFromCategories1657049676708';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "questions_categories" DROP CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba"`);
        await queryRunner.query(`ALTER TABLE "questions_categories" ADD CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "questions_categories" DROP CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba"`);
        await queryRunner.query(`ALTER TABLE "questions_categories" ADD CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.removeQuestionsColumnFromCategories1657049676708 = removeQuestionsColumnFromCategories1657049676708;
//# sourceMappingURL=1657049676708-remove-questions-column-from-categories.js.map