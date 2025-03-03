import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnRequiresAttachments1657104915117
    implements MigrationInterface
{
    name = 'addColumnRequiresAttachments1657104915117';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "questions" RENAME COLUMN "numberOfAttachments" TO "requiresAttachments"`,
        );
        await queryRunner.query(
            `ALTER TABLE "questions" DROP COLUMN "requiresAttachments"`,
        );
        await queryRunner.query(
            `ALTER TABLE "questions" ADD "requiresAttachments" boolean NOT NULL DEFAULT false`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "questions" DROP COLUMN "requiresAttachments"`,
        );
        await queryRunner.query(
            `ALTER TABLE "questions" ADD "requiresAttachments" integer NOT NULL DEFAULT '0'`,
        );
        await queryRunner.query(
            `ALTER TABLE "questions" RENAME COLUMN "requiresAttachments" TO "numberOfAttachments"`,
        );
    }
}
