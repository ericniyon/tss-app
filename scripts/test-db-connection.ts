import 'dotenv/config';
import { createConnection } from 'typeorm';
import typeOrmConfig from '../src/shared/config/typeorm.config';

async function testConnection() {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        console.log(`Host: ${process.env.POSTGRES_HOST}`);
        console.log(`Port: ${process.env.POSTGRES_PORT}`);
        console.log(`Database: ${process.env.POSTGRES_DB}`);
        console.log(`User: ${process.env.POSTGRES_USER}\n`);
        
        connection = await createConnection({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT || '5432'),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            synchronize: false,
            logging: false,
        });
        
        console.log('✅ Successfully connected to database!\n');
        
        // Test query
        const result = await connection.query('SELECT version()');
        console.log('📊 Database version:', result[0].version);
        
        // Check if we can query tables
        const tables = await connection.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log(`\n📋 Found ${tables.length} tables in the database:`);
        tables.forEach((table: any) => {
            console.log(`   - ${table.table_name}`);
        });
        
        await connection.close();
        console.log('\n✅ Connection closed successfully.');
    } catch (error) {
        console.error('❌ Error connecting to database:');
        console.error(error);
        if (connection) {
            await connection.close();
        }
        process.exit(1);
    }
}

testConnection();

