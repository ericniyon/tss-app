"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionSeedService = void 0;
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const section_entity_1 = require("../../section/entities/section.entity");
const env_util_1 = require("../utils/env.util");
let SectionSeedService = class SectionSeedService {
    constructor(entityManager) {
        this.entityManager = entityManager;
    }
    async seed() {
        if (!(await this.entityManager.findOne(section_entity_1.Section, {
            where: [
                { title: (0, typeorm_1.ILike)('General Information') },
                { readonly: true },
            ],
        }))) {
            const section = new section_entity_1.Section();
            section.title = 'General Information';
            section.tips = faker_1.faker.lorem.paragraph();
            section.readonly = true;
            await this.entityManager.save(section_entity_1.Section, section);
        }
        if ((0, env_util_1.isRunningInDevelopment)()) {
            const sections = [
                'Business Information',
                'Operations',
                'Revenue Management',
                'Advertisement',
            ];
            for (const sectionName of sections) {
                if (!(await this.entityManager.findOne(section_entity_1.Section, {
                    title: sectionName,
                }))) {
                    const section = new section_entity_1.Section();
                    section.title = sectionName;
                    section.tips = faker_1.faker.lorem.paragraph();
                    await this.entityManager.save(section_entity_1.Section, section);
                }
            }
        }
    }
};
SectionSeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager])
], SectionSeedService);
exports.SectionSeedService = SectionSeedService;
//# sourceMappingURL=section.seed-service.js.map