"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSection1740684319877 = void 0;
class deleteSection1740684319877 {
    async up(queryRunner) {
        await queryRunner.query(`DROP TABLE "subsections"`);
    }
    async down(queryRunner) {
    }
}
exports.deleteSection1740684319877 = deleteSection1740684319877;
//# sourceMappingURL=1740681319877-delete-section.js.map