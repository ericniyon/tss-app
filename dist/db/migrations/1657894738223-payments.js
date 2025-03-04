"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payments1657894738223 = void 0;
class payments1657894738223 {
    constructor() {
        this.name = 'payments1657894738223';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amount" integer NOT NULL, "type" character varying NOT NULL, "certificateId" integer, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_b6b36ce2f6c5dc848546b4a88ba" FOREIGN KEY ("certificateId") REFERENCES "certificates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_b6b36ce2f6c5dc848546b4a88ba"`);
        await queryRunner.query(`DROP TABLE "payments"`);
    }
}
exports.payments1657894738223 = payments1657894738223;
//# sourceMappingURL=1657894738223-payments.js.map