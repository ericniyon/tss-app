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

async function checkAnswersStructure() {
    try {
        await client.connect();
        console.log('Connected to database\n');

        // Check answers table structure
        console.log('=== 1. Answers Table Structure ===');
        const tableInfo = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'answers'
            ORDER BY ordinal_position
        `);
        console.log('Columns:', tableInfo.rows);

        // Check total answers count
        console.log('\n=== 2. Total Answers Count ===');
        const totalCount = await client.query('SELECT COUNT(*) as total FROM answers');
        console.log(`Total answers in database: ${totalCount.rows[0].total}`);

        // Check answers with applicationId 156 (checking different column names)
        console.log('\n=== 3. Checking Answers for Application 156 ===');
        const answers156a = await client.query('SELECT COUNT(*) as total FROM answers WHERE "applicationId" = 156');
        console.log(`Answers with applicationId = 156: ${answers156a.rows[0].total}`);

        // Check if there's a deletedAt column (soft delete)
        const hasDeletedAt = tableInfo.rows.some(r => r.column_name === 'deletedAt');
        if (hasDeletedAt) {
            console.log('\n=== 4. Checking Soft Deleted Answers ===');
            const deletedCount = await client.query('SELECT COUNT(*) as total FROM answers WHERE "applicationId" = 156 AND "deletedAt" IS NOT NULL');
            console.log(`Soft deleted answers: ${deletedCount.rows[0].total}`);
            
            // Check with deletedAt IS NULL
            const activeAnswers = await client.query('SELECT COUNT(*) as total FROM answers WHERE "applicationId" = 156 AND "deletedAt" IS NULL');
            console.log(`Active answers (deletedAt IS NULL): ${activeAnswers.rows[0].total}`);
        }

        // Check recent answers for any application
        console.log('\n=== 5. Recent Answers (Sample) ===');
        const recentAnswers = await client.query(`
            SELECT id, "applicationId", "questionId", "createdAt"
            FROM answers
            ORDER BY "createdAt" DESC
            LIMIT 10
        `);
        console.log('Recent answers:', recentAnswers.rows);

        // Check if application 156 has any related data
        console.log('\n=== 6. Application 156 Related Data ===');
        const app156Answers = await client.query(`
            SELECT a.*, q.text as question_text, s.title as section_title
            FROM answers a
            LEFT JOIN questions q ON a."questionId" = q.id
            LEFT JOIN sections s ON q."sectionId" = s.id
            WHERE a."applicationId" = 156
            LIMIT 5
        `);
        console.log(`Found ${app156Answers.rows.length} answers for application 156`);
        if (app156Answers.rows.length > 0) {
            console.log('Sample:', app156Answers.rows[0]);
        }

        // Check all applications with answers
        console.log('\n=== 7. Applications with Answers ===');
        const appsWithAnswers = await client.query(`
            SELECT "applicationId", COUNT(*) as answer_count
            FROM answers
            GROUP BY "applicationId"
            ORDER BY answer_count DESC
            LIMIT 10
        `);
        console.log('Top applications by answer count:', appsWithAnswers.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkAnswersStructure();

