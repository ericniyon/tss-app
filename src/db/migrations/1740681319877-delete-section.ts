import {MigrationInterface, QueryRunner} from "typeorm";

export class deleteSection1740684319877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subsections"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
