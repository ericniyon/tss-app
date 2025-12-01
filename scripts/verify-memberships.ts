import 'dotenv/config';
import { createConnection, getRepository } from 'typeorm';
import { Membership } from '../src/membership/entities/membership.entity';

async function verifyMemberships() {
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
            entities: [Membership],
            synchronize: false,
            logging: false,
        });
        
        console.log('✅ Connected to database!\n');

        const membershipRepository = getRepository(Membership);
        
        const total = await membershipRepository.count();
        console.log(`📊 Total memberships: ${total}\n`);

        // Get sample records
        const samples = await membershipRepository.find({
            take: 5,
            order: { id: 'ASC' },
        });

        console.log('📋 Sample records:\n');
        samples.forEach((membership, index) => {
            console.log(`${index + 1}. ${membership.companyName}`);
            console.log(`   ID: ${membership.membershipId}`);
            console.log(`   Category: ${membership.membershipCategory}`);
            console.log(`   Email: ${membership.email || 'N/A'}`);
            console.log(`   Website: ${membership.companyWebsite || 'N/A'}`);
            console.log('');
        });

        // Count by category
        const categories = await membershipRepository
            .createQueryBuilder('membership')
            .select('membership.membershipCategory', 'category')
            .addSelect('COUNT(*)', 'count')
            .groupBy('membership.membershipCategory')
            .orderBy('count', 'DESC')
            .getRawMany();

        console.log('📊 Memberships by category:\n');
        categories.forEach((cat: any) => {
            console.log(`   ${cat.category}: ${cat.count}`);
        });

        await connection.close();
        console.log('\n✅ Connection closed.');
    } catch (error) {
        console.error('❌ Error:', error);
        if (connection) {
            await connection.close();
        }
        process.exit(1);
    }
}

verifyMemberships();

