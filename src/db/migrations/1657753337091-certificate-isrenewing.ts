import { MigrationInterface, QueryRunner } from 'typeorm';

export class certificateIsrenewing1657753337091 implements MigrationInterface {
    name = 'certificateIsrenewing1657753337091';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "certificates" ADD "isRenewing" boolean NOT NULL DEFAULT false`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "certificates" DROP COLUMN "isRenewing"`,
        );
    }
}
