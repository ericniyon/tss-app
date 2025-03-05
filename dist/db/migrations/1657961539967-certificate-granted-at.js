"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateGrantedAt1657961539967 = void 0;
class certificateGrantedAt1657961539967 {
    constructor() {
        this.name = 'certificateGrantedAt1657961539967';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "certificates" ADD "grantedAt" TIMESTAMP`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "certificates" DROP COLUMN "grantedAt"`);
    }
}
exports.certificateGrantedAt1657961539967 = certificateGrantedAt1657961539967;
//# sourceMappingURL=1657961539967-certificate-granted-at.js.map