"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnRequiresAttachments1657104915117 = void 0;
class addColumnRequiresAttachments1657104915117 {
    constructor() {
        this.name = 'addColumnRequiresAttachments1657104915117';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "questions" RENAME COLUMN "numberOfAttachments" TO "requiresAttachments"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "requiresAttachments"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "requiresAttachments" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "questions" DROP COLUMN "requiresAttachments"`);
        await queryRunner.query(`ALTER TABLE "questions" ADD "requiresAttachments" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "questions" RENAME COLUMN "requiresAttachments" TO "numberOfAttachments"`);
    }
}
exports.addColumnRequiresAttachments1657104915117 = addColumnRequiresAttachments1657104915117;
//# sourceMappingURL=1657104915117-add-column-requiresAttachments.js.map