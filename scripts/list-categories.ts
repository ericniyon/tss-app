import 'dotenv/config';
import { createConnection, getRepository } from 'typeorm';
import { Category } from '../src/category/entities/category.entity';

async function listCategories() {
    let connection;
    try {
        console.log('Connecting to database...');
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
            entities: [Category],
            synchronize: false,
            logging: false,
        });
        
        console.log('✅ Connected to database successfully!\n');

        const categoryRepository = getRepository(Category);
        
        const categories = await categoryRepository.find({
            order: { id: 'ASC' },
        });

        if (categories.length === 0) {
            console.log('No categories found in the database.');
        } else {
            console.log(`Found ${categories.length} category/categories:\n`);
            console.log('ID  | Name                          | Active | Created At');
            console.log('----|-------------------------------|--------|-------------------');
            
            categories.forEach((category) => {
                const id = category.id.toString().padEnd(3);
                const name = (category.name || '').padEnd(30);
                const active = category.active ? 'Yes' : 'No';
                const createdAt = category.createdAt
                    ? new Date(category.createdAt).toLocaleDateString()
                    : 'N/A';
                console.log(`${id} | ${name} | ${active.padEnd(6)} | ${createdAt}`);
            });
        }

        await connection.close();
        console.log('\n✅ Connection closed.');
    } catch (error) {
        console.error('❌ Error connecting to database:');
        console.error(error);
        if (connection) {
            await connection.close();
        }
        process.exit(1);
    }
}

listCategories();

