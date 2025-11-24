import { MigrationInterface, QueryRunner } from 'typeorm';

export class applicationSnapshots1732447200000 implements MigrationInterface {
    name = 'applicationSnapshots1732447200000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "application_snapshots" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "payload" jsonb NOT NULL, "applicationId" integer NOT NULL, CONSTRAINT "PK_25f5c13c7de93e9b3e55d3eb7df" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "application_snapshots" ADD CONSTRAINT "FK_7b4d257a7b82d49f683e4c2a8ba" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "application_snapshots" DROP CONSTRAINT "FK_7b4d257a7b82d49f683e4c2a8ba"`,
        );
        await queryRunner.query(`DROP TABLE "application_snapshots"`);
    }
}

