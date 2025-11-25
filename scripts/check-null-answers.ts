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

async function checkNullAnswers() {
    try {
        await client.connect();
        console.log('Connected to database\n');

        // Check answers with null applicationId
        console.log('=== 1. Answers with NULL applicationId ===');
        const nullAnswers = await client.query(`
            SELECT id, "questionId", "createdAt", "updatedAt"
            FROM answers
            WHERE "applicationId" IS NULL
            ORDER BY "createdAt" DESC
            LIMIT 10
        `);
        console.log(`Found ${nullAnswers.rows.length} sample null answers`);
        console.log('Sample:', nullAnswers.rows);

        // Check application 160 (which has answers)
        console.log('\n=== 2. Application 160 (has 106 answers) ===');
        const app160 = await client.query(`
            SELECT a.id, a."questionId", q.text as question_text, s.title as section_title
            FROM answers a
            LEFT JOIN questions q ON a."questionId" = q.id
            LEFT JOIN sections s ON q."sectionId" = s.id
            WHERE a."applicationId" = 160
            LIMIT 5
        `);
        console.log('Sample answers for app 160:', app160.rows);

        // Check if we can find answers that might belong to app 156
        console.log('\n=== 3. Checking if null answers might belong to app 156 ===');
        const app156Info = await client.query('SELECT "createdAt", "applicantId" FROM applications WHERE id = 156');
        if (app156Info.rows.length > 0) {
            const appCreatedAt = app156Info.rows[0].createdAt;
            console.log(`App 156 created at: ${appCreatedAt}`);
            
            // Check if there are null answers created around the same time
            const nearbyNullAnswers = await client.query(`
                SELECT COUNT(*) as total
                FROM answers
                WHERE "applicationId" IS NULL
                AND "createdAt" BETWEEN $1::timestamp - INTERVAL '1 day' AND $1::timestamp + INTERVAL '1 day'
            `, [appCreatedAt]);
            console.log(`Null answers created within 1 day of app 156: ${nearbyNullAnswers.rows[0].total}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.end();
    }
}

checkNullAnswers();

