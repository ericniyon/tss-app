"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory1740684353878 = void 0;
class deleteCategory1740684353878 {
    async up(queryRunner) {
        await queryRunner.query(`DROP TABLE "subcategories"`);
    }
    async down(queryRunner) {
    }
}
exports.deleteCategory1740684353878 = deleteCategory1740684353878;
//# sourceMappingURL=1740684153878-delete-category.js.map