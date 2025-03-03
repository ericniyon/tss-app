import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { EntityManager, ILike } from 'typeorm';
import { Section } from '../../section/entities/section.entity';
import { isRunningInDevelopment } from '../utils/env.util';

@Injectable()
export class SectionSeedService {
    constructor(private readonly entityManager: EntityManager) {}

    async seed(): Promise<void> {
        if (
            !(await this.entityManager.findOne(Section, {
                where: [
                    { title: ILike('General Information') },
                    { readonly: true },
                ],
            }))
        ) {
            const section = new Section();
            section.title = 'General Information';
            section.tips = faker.lorem.paragraph();
            section.readonly = true;
            await this.entityManager.save(Section, section);
        }
        if (isRunningInDevelopment()) {
            const sections = [
                'Business Information',
                'Operations',
                'Revenue Management',
                'Advertisement',
            ];
            for (const sectionName of sections) {
                if (
                    !(await this.entityManager.findOne(Section, {
                        title: sectionName,
                    }))
                ) {
                    const section = new Section();
                    section.title = sectionName;
                    section.tips = faker.lorem.paragraph();
                    await this.entityManager.save(Section, section);
                }
            }
        }
    }
}
