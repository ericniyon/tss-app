import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class removeQuestionsColumnFromCategories1657049676708 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
