import { MigrationInterface, QueryRunner } from 'typeorm';

export class payments1657894738223 implements MigrationInterface {
    name = 'payments1657894738223';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "payments" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amount" integer NOT NULL, "type" character varying NOT NULL, "certificateId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "payments" ADD CONSTRAINT "FK_b6b36ce2f6c5dc848546b4a88ba" FOREIGN KEY ("certificateId") REFERENCES "certificates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "payments" DROP CONSTRAINT "FK_b6b36ce2f6c5dc848546b4a88ba"`,
        );
        await queryRunner.query(`DROP TABLE "payments"`);
    }
}
