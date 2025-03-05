"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateIsrenewing1657753337091 = void 0;
class certificateIsrenewing1657753337091 {
    constructor() {
        this.name = 'certificateIsrenewing1657753337091';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "certificates" ADD "isRenewing" boolean NOT NULL DEFAULT false`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "certificates" DROP COLUMN "isRenewing"`);
    }
}
exports.certificateIsrenewing1657753337091 = certificateIsrenewing1657753337091;
//# sourceMappingURL=1657753337091-certificate-isrenewing.js.map