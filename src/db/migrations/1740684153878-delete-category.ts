import {MigrationInterface, QueryRunner} from "typeorm";

export class deleteCategory1740684353878 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subcategories"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
