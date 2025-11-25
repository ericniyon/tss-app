import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    host: process.env.POSTGRES_HOST || 'viaduct.proxy.rlwy.net',
    port: parseInt(process.env.POSTGRES_PORT || '36544'),
    database: process.env.POSTGRES_DB || 'railway',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'DVAqGhEScFgJNNuYBEKzgpjsXgtaAUvl',
});

async function checkApplicationData() {
    try {
        await client.connect();
        console.log('Connected to database\n');

        const applicationId = 156;

        // 1. Check if application exists
        console.log('=== 1. Checking Application 156 ===');
        const appResult = await client.query(
            'SELECT id, "companyUrl", status, "categoryId", "applicantId", "createdAt" FROM applications WHERE id = $1',
            [applicationId]
        );
        if (appResult.rows.length === 0) {
            console.log('❌ Application 156 not found');
            return;
        }
        console.log('✅ Application found:', appResult.rows[0]);
        const categoryId = appResult.rows[0].categoryId;

        // 2. Check answers for this application
        console.log('\n=== 2. Checking Answers for Application 156 ===');
        const answersResult = await client.query(
            'SELECT id, "questionId", responses, attachments, status, feedback, "createdAt" FROM answers WHERE "applicationId" = $1 ORDER BY id',
            [applicationId]
        );
        console.log(`✅ Found ${answersResult.rows.length} answers`);
        if (answersResult.rows.length > 0) {
            console.log('Sample answers:', answersResult.rows.slice(0, 3));
        }

        // 3. Check question-answer relationships
        console.log('\n=== 3. Checking Question-Answer Relationships ===');
        const questionIds = answersResult.rows.map(a => a.questionId).filter(Boolean);
        if (questionIds.length > 0) {
            const questionsResult = await client.query(
                `SELECT id, text, type, "sectionId", active FROM questions WHERE id = ANY($1::int[])`,
                [questionIds]
            );
            console.log(`✅ Found ${questionsResult.rows.length} questions linked to answers`);
            console.log('Sample questions:', questionsResult.rows.slice(0, 3));

            // Check if questions have sections
            const sectionIds = questionsResult.rows.map(q => q.sectionId).filter(Boolean);
            if (sectionIds.length > 0) {
                const sectionsResult = await client.query(
                    `SELECT id, title, tips, active FROM sections WHERE id = ANY($1::int[])`,
                    [sectionIds]
                );
                console.log(`✅ Found ${sectionsResult.rows.length} sections`);
                console.log('Sections:', sectionsResult.rows);
            }
        }

        // 4. Check category questions
        console.log('\n=== 4. Checking Category Questions ===');
        const categoryQuestionsResult = await client.query(
            `SELECT COUNT(*) as total FROM questions q
             INNER JOIN questions_categories qc ON q.id = qc."questionsId"
             WHERE qc."categoriesId" = $1 AND q.active = true`,
            [categoryId]
        );
        console.log(`✅ Total active questions in category: ${categoryQuestionsResult.rows[0].total}`);

        // 5. Detailed answer-question-section mapping
        console.log('\n=== 5. Detailed Answer-Question-Section Mapping ===');
        const detailedResult = await client.query(
            `SELECT 
                a.id as answer_id,
                a."questionId",
                q.text as question_text,
                q.type as question_type,
                s.id as section_id,
                s.title as section_title,
                a.responses,
                a.status
             FROM answers a
             LEFT JOIN questions q ON a."questionId" = q.id
             LEFT JOIN sections s ON q."sectionId" = s.id
             WHERE a."applicationId" = $1
             ORDER BY s.id, q.id
             LIMIT 10`,
            [applicationId]
        );
        console.log(`✅ Detailed mapping (first 10):`);
        detailedResult.rows.forEach(row => {
            console.log(`  Answer ${row.answer_id} -> Question ${row.questionId} (${row.question_text?.substring(0, 50)}...) -> Section ${row.section_id} (${row.section_title})`);
        });

        // 6. Check for orphaned answers (answers without questions)
        console.log('\n=== 6. Checking for Orphaned Answers ===');
        const orphanedResult = await client.query(
            `SELECT a.id, a."questionId" FROM answers a
             LEFT JOIN questions q ON a."questionId" = q.id
             WHERE a."applicationId" = $1 AND q.id IS NULL`,
            [applicationId]
        );
        if (orphanedResult.rows.length > 0) {
            console.log(`⚠️  Found ${orphanedResult.rows.length} orphaned answers (question doesn't exist):`, orphanedResult.rows);
        } else {
            console.log('✅ No orphaned answers found');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkApplicationData();

