"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubsectionModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const subsection_entity_1 = require("./entities/subsection.entity");
const subsection_controller_1 = require("./subsection.controller");
const subsection_service_1 = require("./subsection.service");
let SubsectionModule = class SubsectionModule {
};
SubsectionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([subsection_entity_1.Subsection])],
        controllers: [subsection_controller_1.SubsectionController],
        providers: [subsection_service_1.SubsectionService],
    })
], SubsectionModule);
exports.SubsectionModule = SubsectionModule;
//# sourceMappingURL=subsection.module.js.map