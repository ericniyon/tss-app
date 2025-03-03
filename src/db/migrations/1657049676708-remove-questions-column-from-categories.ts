import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeQuestionsColumnFromCategories1657049676708
    implements MigrationInterface
{
    name = 'removeQuestionsColumnFromCategories1657049676708';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "questions_categories" DROP CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba"`,
        );
        await queryRunner.query(
            `ALTER TABLE "questions_categories" ADD CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "questions_categories" DROP CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba"`,
        );
        await queryRunner.query(
            `ALTER TABLE "questions_categories" ADD CONSTRAINT "FK_441e3eb944161ffdc97a7f466ba" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
