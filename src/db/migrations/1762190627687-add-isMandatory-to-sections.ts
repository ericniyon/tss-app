import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsMandatoryToSections1762190627687
    implements MigrationInterface
{
    name = 'addIsMandatoryToSections1762190627687';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "sections" ADD "isMandatory" boolean`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "sections" DROP COLUMN "isMandatory"`,
        );
    }
}

