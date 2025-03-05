"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubsectionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_subsection_dto_1 = require("./create-subsection.dto");
class UpdateSubsectionDto extends (0, swagger_1.PartialType)(create_subsection_dto_1.CreateSubsectionDto) {
}
exports.UpdateSubsectionDto = UpdateSubsectionDto;
//# sourceMappingURL=update-subsection.dto.js.map