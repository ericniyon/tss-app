"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModule = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const category_controller_1 = require("./category.controller");
const category_entity_1 = require("./entities/category.entity");
const typeorm_1 = require("@nestjs/typeorm");
const subcategory_entity_1 = require("../subcategory/entities/subcategory.entity");
const section_entity_1 = require("../section/entities/section.entity");
const subsection_entity_1 = require("../subsection/entities/subsection.entity");
const question_entity_1 = require("../question/entities/question.entity");
const application_entity_1 = require("../application/entities/application.entity");
const answer_entity_1 = require("../application/entities/answer.entity");
const certificate_entity_1 = require("../certificate/entities/certificate.entity");
const notification_entity_1 = require("../notification/entities/notification.entity");
let CategoryModule = class CategoryModule {
};
CategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                category_entity_1.Category,
                subcategory_entity_1.Subcategory,
                section_entity_1.Section,
                subsection_entity_1.Subsection,
                question_entity_1.Question,
                application_entity_1.Application,
                answer_entity_1.Answer,
                certificate_entity_1.Certificate,
                notification_entity_1.Notification,
            ]),
        ],
        controllers: [category_controller_1.CategoryController],
        providers: [category_service_1.CategoryService],
    })
], CategoryModule);
exports.CategoryModule = CategoryModule;
//# sourceMappingURL=category.module.js.map