"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubcategoryModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const subcategory_entity_1 = require("./entities/subcategory.entity");
const subcategory_controller_1 = require("./subcategory.controller");
const subcategory_service_1 = require("./subcategory.service");
const common_1 = require("@nestjs/common");
let SubcategoryModule = class SubcategoryModule {
};
SubcategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([subcategory_entity_1.Subcategory])],
        controllers: [subcategory_controller_1.SubcategoryController],
        providers: [subcategory_service_1.SubcategoryService],
    })
], SubcategoryModule);
exports.SubcategoryModule = SubcategoryModule;
//# sourceMappingURL=subcategory.module.js.map