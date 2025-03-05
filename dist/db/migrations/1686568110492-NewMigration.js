"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewMigration1686568110492 = void 0;
class NewMigration1686568110492 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "sections" ADD "sectionCategory" integer NOT NULL DEFAULT '1'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "sections" DROP COLUMN "sectionCategory"`);
    }
}
exports.NewMigration1686568110492 = NewMigration1686568110492;
//# sourceMappingURL=1686568110492-NewMigration.js.map