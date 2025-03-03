import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { EntityManager, ILike } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Injectable()
export class CategorySeedService {
    constructor(private readonly entityManager: EntityManager) {}

    async seed(): Promise<void> {
        if (
            !(await this.entityManager.findOne(Category, {
                where: { name: ILike('Test Category') },
            }))
        )
            await this.entityManager.save(Category, {
                ...new Category(),
                name: 'Test Category',
            } as Category);
        if ((await this.entityManager.count(Category)) <= 20) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const _ of Array(20).fill('i')) {
                const name = faker.company.bsAdjective();
                if (
                    !(await this.entityManager.findOne(Category, {
                        name,
                    }))
                ) {
                    const category = new Category();
                    category.name = name;
                    await this.entityManager.save(Category, category);
                }
            }
        }
    }
}
