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
exports.CategorySeedService = void 0;
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../../category/entities/category.entity");
let CategorySeedService = class CategorySeedService {
    constructor(entityManager) {
        this.entityManager = entityManager;
    }
    async seed() {
        if (!(await this.entityManager.findOne(category_entity_1.Category, {
            where: { name: (0, typeorm_1.ILike)('Test Category') },
        })))
            await this.entityManager.save(category_entity_1.Category, Object.assign(Object.assign({}, new category_entity_1.Category()), { name: 'Test Category' }));
        if ((await this.entityManager.count(category_entity_1.Category)) <= 20) {
            for (const _ of Array(20).fill('i')) {
                const name = faker_1.faker.company.bsAdjective();
                if (!(await this.entityManager.findOne(category_entity_1.Category, {
                    name,
                }))) {
                    const category = new category_entity_1.Category();
                    category.name = name;
                    await this.entityManager.save(category_entity_1.Category, category);
                }
            }
        }
    }
};
CategorySeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager])
], CategorySeedService);
exports.CategorySeedService = CategorySeedService;
//# sourceMappingURL=category.seed-service.js.map