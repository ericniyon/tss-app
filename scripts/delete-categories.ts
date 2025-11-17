import 'dotenv/config';
import { createConnection, getRepository } from 'typeorm';
import { Category } from '../src/category/entities/category.entity';
import { Subcategory } from '../src/subcategory/entities/subcategory.entity';
import { Section } from '../src/section/entities/section.entity';
import { Subsection } from '../src/subsection/entities/subsection.entity';
import { Question } from '../src/question/entities/question.entity';
import { Application } from '../src/application/entities/application.entity';
import { Answer } from '../src/application/entities/answer.entity';
import { Certificate } from '../src/certificate/entities/certificate.entity';
import { Notification } from '../src/notification/entities/notification.entity';
import { In } from 'typeorm';

async function deleteCategories(categoryIds: number[]) {
    let connection;
    try {
        console.log('Connecting to database...');
        console.log(`Host: ${process.env.POSTGRES_HOST}`);
        console.log(`Database: ${process.env.POSTGRES_DB}\n`);
        
        connection = await createConnection({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT || '5432'),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [
                __dirname + '/../src/**/*.entity{.ts,.js}',
            ],
            synchronize: false,
            logging: false,
        });
        
        console.log('✅ Connected to database successfully!\n');

        const categoryRepo = getRepository(Category);
        const subcategoryRepo = getRepository(Subcategory);
        const sectionRepo = getRepository(Section);
        const subsectionRepo = getRepository(Subsection);
        const questionRepo = getRepository(Question);
        const applicationRepo = getRepository(Application);
        const answerRepo = getRepository(Answer);
        const certificateRepo = getRepository(Certificate);
        const notificationRepo = getRepository(Notification);

        // Verify categories exist
        const categories = await categoryRepo.find({
            where: { id: In(categoryIds) },
        });

        if (categories.length === 0) {
            console.log('❌ No categories found with the provided IDs.');
            await connection.close();
            return;
        }

        console.log(`Found ${categories.length} category/categories to delete:\n`);
        categories.forEach((cat) => {
            console.log(`  - ID ${cat.id}: ${cat.name} (Active: ${cat.active ? 'Yes' : 'No'})`);
        });

        console.log('\n⚠️  WARNING: This will permanently delete:');
        console.log('  - All subcategories');
        console.log('  - All sections');
        console.log('  - All subsections');
        console.log('  - All questions');
        console.log('  - All applications');
        console.log('  - All answers');
        console.log('  - All certificates');
        console.log('  - All notifications');
        console.log('  - The categories themselves\n');

        // Use transaction for each category deletion
        for (const category of categories) {
            console.log(`\n🗑️  Deleting category ID ${category.id}: ${category.name}...`);
            
            await connection.manager.transaction(async (transactionalEntityManager) => {
                // 1. Get all subcategories for this category
                const subcategories = await transactionalEntityManager.find(
                    Subcategory,
                    {
                        where: { category: { id: category.id } },
                    },
                );
                const subcategoryIds = subcategories.map((sc) => sc.id);
                if (subcategoryIds.length > 0) {
                    console.log(`   Found ${subcategoryIds.length} subcategories`);
                }

                // 2. Get all sections belonging to these subcategories
                const sections =
                    subcategoryIds.length > 0
                        ? await transactionalEntityManager.find(Section, {
                              where: { subcategoryId: In(subcategoryIds) },
                          })
                        : [];
                const sectionIds = sections.map((s) => s.id);
                if (sectionIds.length > 0) {
                    console.log(`   Found ${sectionIds.length} sections`);
                }

                // 3. Get all subsections belonging to these sections
                const subsections =
                    sectionIds.length > 0
                        ? await transactionalEntityManager
                              .createQueryBuilder(Subsection, 'ss')
                              .where('ss.section IN (:...sectionIds)', {
                                  sectionIds,
                              })
                              .getMany()
                        : [];
                const subsectionIds = subsections.map((ss) => ss.id);
                if (subsectionIds.length > 0) {
                    console.log(`   Found ${subsectionIds.length} subsections`);
                }

                // 4. Get all questions related to this category (multiple paths)
                const questionsViaCategory =
                    await transactionalEntityManager
                        .createQueryBuilder(Question, 'q')
                        .innerJoin('q.categories', 'c')
                        .where('c.id = :categoryId', { categoryId: category.id })
                        .getMany();

                const questionsViaSubcategory =
                    subcategoryIds.length > 0
                        ? await transactionalEntityManager.find(Question, {
                              where: { subcategory: { id: In(subcategoryIds) } },
                          })
                        : [];

                const questionsViaSection =
                    sectionIds.length > 0
                        ? await transactionalEntityManager.find(Question, {
                              where: { section: { id: In(sectionIds) } },
                          })
                        : [];

                const questionsViaSubsection =
                    subsectionIds.length > 0
                        ? await transactionalEntityManager.find(Question, {
                              where: {
                                  subsection: { id: In(subsectionIds) },
                              },
                          })
                        : [];

                const allQuestionIds = [
                    ...new Set([
                        ...questionsViaCategory.map((q) => q.id),
                        ...questionsViaSubcategory.map((q) => q.id),
                        ...questionsViaSection.map((q) => q.id),
                        ...questionsViaSubsection.map((q) => q.id),
                    ]),
                ];
                if (allQuestionIds.length > 0) {
                    console.log(`   Found ${allQuestionIds.length} questions`);
                }

                // 5. Get all applications for this category
                const applications =
                    await transactionalEntityManager.find(Application, {
                        where: { category: { id: category.id } },
                    });
                const applicationIds = applications.map((a) => a.id);
                if (applicationIds.length > 0) {
                    console.log(`   Found ${applicationIds.length} applications`);
                }

                // 6. Delete Answers
                if (allQuestionIds.length > 0 || applicationIds.length > 0) {
                    let answerQueryBuilder =
                        transactionalEntityManager
                            .createQueryBuilder()
                            .delete()
                            .from(Answer);

                    const conditions: string[] = [];
                    const parameters: any = {};

                    if (allQuestionIds.length > 0) {
                        conditions.push('questionId IN (:...questionIds)');
                        parameters.questionIds = allQuestionIds;
                    }
                    if (applicationIds.length > 0) {
                        conditions.push('applicationId IN (:...applicationIds)');
                        parameters.applicationIds = applicationIds;
                    }

                    if (conditions.length > 0) {
                        await answerQueryBuilder
                            .where(conditions.join(' OR '), parameters)
                            .execute();
                    }
                }

                // 7. Delete Certificates
                if (applicationIds.length > 0) {
                    await transactionalEntityManager
                        .createQueryBuilder()
                        .delete()
                        .from(Certificate)
                        .where('applicationId IN (:...applicationIds)', {
                            applicationIds,
                        })
                        .execute();
                }

                // 8. Delete Applications
                if (applicationIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Application,
                        applicationIds,
                    );
                }

                // 9. Delete Questions
                if (allQuestionIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Question,
                        allQuestionIds,
                    );
                }

                // 10. Delete Subsections
                if (subsectionIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Subsection,
                        subsectionIds,
                    );
                }

                // 11. Delete Sections
                if (sectionIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Section,
                        sectionIds,
                    );
                }

                // 12. Delete Subcategories
                if (subcategoryIds.length > 0) {
                    await transactionalEntityManager.delete(
                        Subcategory,
                        subcategoryIds,
                    );
                }

                // 13. Delete Notifications
                await transactionalEntityManager
                    .createQueryBuilder()
                    .delete()
                    .from(Notification)
                    .where('targetCategoryId = :categoryId', {
                        categoryId: category.id,
                    })
                    .execute();

                // 14. Finally, delete the Category
                await transactionalEntityManager.delete(Category, category.id);
            });

            console.log(`   ✅ Category ID ${category.id} deleted successfully`);
        }

        console.log('\n✅ All categories deleted successfully!');
        await connection.close();
        console.log('✅ Connection closed.');
    } catch (error) {
        console.error('❌ Error deleting categories:');
        console.error(error);
        if (connection) {
            await connection.close();
        }
        process.exit(1);
    }
}

// Categories to delete
const categoriesToDelete = [3, 4, 10];

console.log('🚨 CATEGORY DELETION SCRIPT\n');
console.log('Categories to delete:');
categoriesToDelete.forEach((id) => {
    console.log(`  - ID ${id}`);
});
console.log('');

deleteCategories(categoriesToDelete);

