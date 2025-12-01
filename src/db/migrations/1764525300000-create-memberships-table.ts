import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMembershipsTable1764525300000 implements MigrationInterface {
    name = 'CreateMembershipsTable1764525300000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "memberships" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "membership_id" character varying,
                "company_name" character varying NOT NULL,
                "membership_category" character varying NOT NULL,
                "last_name" character varying,
                "phone_number" character varying,
                "email" character varying,
                "tin_numbers" character varying,
                "company_website" character varying,
                CONSTRAINT "PK_memberships" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_membership_id" ON "memberships" ("membership_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_membership_id"`);
        await queryRunner.query(`DROP TABLE "memberships"`);
    }
}

