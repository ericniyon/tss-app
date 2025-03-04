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
exports.QuestionSeedService = void 0;
const faker_1 = require("@faker-js/faker");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const question_entity_1 = require("../../question/entities/question.entity");
const enums_1 = require("../../question/enums");
const section_entity_1 = require("../../section/entities/section.entity");
let QuestionSeedService = class QuestionSeedService {
    constructor(entityManager) {
        this.entityManager = entityManager;
    }
    async seed() {
        if ((await this.entityManager.count(question_entity_1.Question, { active: true })) < 40) {
            const sections = await this.entityManager.find(section_entity_1.Section, {
                where: { active: true },
            });
            for (const section of sections) {
                for (const _i of Array(3).fill(null)) {
                    const text1 = `${faker_1.default.hacker.phrase()}?`;
                    const openQuestion = new question_entity_1.Question();
                    openQuestion.text = text1;
                    openQuestion.type = enums_1.EType.OPEN;
                    openQuestion.section = section;
                    if (faker_1.default.datatype.number() % 2 === 0)
                        openQuestion.requiresAttachments = true;
                    await this.entityManager.save(question_entity_1.Question, openQuestion);
                    const yesOrNoQuestion = new question_entity_1.Question();
                    const text2 = `${faker_1.default.hacker.phrase()}?`;
                    yesOrNoQuestion.text = text2;
                    yesOrNoQuestion.type = enums_1.EType.SINGLE_CHOICE;
                    yesOrNoQuestion.section = section;
                    if (faker_1.default.datatype.number() % 2 === 0)
                        yesOrNoQuestion.requiresAttachments = true;
                    yesOrNoQuestion.possibleAnswers = [
                        faker_1.default.company.catchPhrase(),
                        faker_1.default.company.catchPhrase(),
                        faker_1.default.company.catchPhrase(),
                    ];
                    await this.entityManager.save(question_entity_1.Question, yesOrNoQuestion);
                    const multipleChoiceQuestion = new question_entity_1.Question();
                    const text3 = `${faker_1.default.hacker.phrase()}?`;
                    multipleChoiceQuestion.text = text3;
                    multipleChoiceQuestion.type = enums_1.EType.MULTIPLE_CHOICE;
                    multipleChoiceQuestion.section = section;
                    if (faker_1.default.datatype.number() % 2 === 0)
                        multipleChoiceQuestion.requiresAttachments = true;
                    faker_1.default.datatype.number(5);
                    multipleChoiceQuestion.possibleAnswers = [
                        faker_1.default.company.catchPhrase(),
                        faker_1.default.company.catchPhrase(),
                        faker_1.default.company.catchPhrase(),
                        faker_1.default.company.catchPhrase(),
                    ];
                    await this.entityManager.save(question_entity_1.Question, multipleChoiceQuestion);
                }
            }
        }
    }
};
QuestionSeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.EntityManager])
], QuestionSeedService);
exports.QuestionSeedService = QuestionSeedService;
//# sourceMappingURL=question.seed-service.js.map