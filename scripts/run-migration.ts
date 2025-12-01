import 'dotenv/config';
import { createConnection } from 'typeorm';
import typeOrmConfig from '../src/shared/config/typeorm.config';

async function runMigration() {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        connection = await createConnection({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT || '5432'),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: ['src/**/*.entity.ts'],
            migrations: ['src/db/migrations/*.ts'],
            synchronize: false,
            logging: true,
        });
        
        console.log('✅ Connected to database!\n');
        console.log('🔄 Running migrations...\n');
        
        await connection.runMigrations();
        
        console.log('✅ Migrations completed!\n');
        
        await connection.close();
        console.log('✅ Connection closed.');
    } catch (error) {
        console.error('❌ Error:', error);
        if (connection) {
            await connection.close();
        }
        process.exit(1);
    }
}

runMigration();

