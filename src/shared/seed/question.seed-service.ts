import faker from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Question } from '../../question/entities/question.entity';
import { EType } from '../../question/enums';
import { Section } from '../../section/entities/section.entity';

@Injectable()
export class QuestionSeedService {
    constructor(private readonly entityManager: EntityManager) {}

    async seed(): Promise<void> {
        if ((await this.entityManager.count(Question, { active: true })) < 40) {
            const sections = await this.entityManager.find(Section, {
                where: { active: true },
            });
            // const categories = await this.entityManager.find(Category, {
            //     where: { active: true },
            //     take: 15,
            // });
            for (const section of sections) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for (const _i of Array(3).fill(null)) {
                    const text1 = `${faker.hacker.phrase()}?`;
                    const openQuestion = new Question();
                    openQuestion.text = text1;
                    openQuestion.type = EType.OPEN;
                    openQuestion.section = section;
                    // openQuestion.categories = [
                    //     categories[0],
                    //     ...categories.filter(
                    //         (cat) => cat.id !== 1 && cat.id <= 5,
                    //     ),
                    // ];
                    if (faker.datatype.number() % 2 === 0)
                        openQuestion.requiresAttachments = true;
                    await this.entityManager.save(Question, openQuestion);

                    const yesOrNoQuestion = new Question();
                    const text2 = `${faker.hacker.phrase()}?`;
                    yesOrNoQuestion.text = text2;
                    yesOrNoQuestion.type = EType.SINGLE_CHOICE;
                    yesOrNoQuestion.section = section;
                    // yesOrNoQuestion.categories = [
                    //     categories[0],
                    //     ...categories.filter(
                    //         (cat) =>
                    //             cat.id !== 1 && cat.id >= 6 && cat.id <= 10,
                    //     ),
                    // ];
                    if (faker.datatype.number() % 2 === 0)
                        yesOrNoQuestion.requiresAttachments = true;
                    yesOrNoQuestion.possibleAnswers = [
                        faker.company.catchPhrase(),
                        faker.company.catchPhrase(),
                        faker.company.catchPhrase(),
                    ];
                    await this.entityManager.save(Question, yesOrNoQuestion);

                    const multipleChoiceQuestion = new Question();
                    const text3 = `${faker.hacker.phrase()}?`;
                    multipleChoiceQuestion.text = text3;
                    multipleChoiceQuestion.type = EType.MULTIPLE_CHOICE;
                    multipleChoiceQuestion.section = section;
                    // multipleChoiceQuestion.categories = [
                    //     categories[0],
                    //     ...categories.filter(
                    //         (cat) =>
                    //             cat.id !== 1 && cat.id >= 11 && cat.id <= 15,
                    //     ),
                    // ];
                    if (faker.datatype.number() % 2 === 0)
                        multipleChoiceQuestion.requiresAttachments = true;
                    faker.datatype.number(5);
                    multipleChoiceQuestion.possibleAnswers = [
                        faker.company.catchPhrase(),
                        faker.company.catchPhrase(),
                        faker.company.catchPhrase(),
                        faker.company.catchPhrase(),
                    ];
                    await this.entityManager.save(
                        Question,
                        multipleChoiceQuestion,
                    );
                }
            }
        }
    }
}
