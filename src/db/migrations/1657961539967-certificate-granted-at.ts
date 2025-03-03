import { MigrationInterface, QueryRunner } from 'typeorm';

export class certificateGrantedAt1657961539967 implements MigrationInterface {
    name = 'certificateGrantedAt1657961539967';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "certificates" ADD "grantedAt" TIMESTAMP`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "certificates" DROP COLUMN "grantedAt"`,
        );
    }
}
