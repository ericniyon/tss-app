import 'dotenv/config';
import { createConnection, getRepository } from 'typeorm';
import { User } from '../src/users/entities/user.entity';
import { Roles } from '../src/shared/enums/roles.enum';

async function verifyUserAccounts() {
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
            synchronize: false,
            logging: false,
        });
        
        console.log('✅ Connected to database!\n');

        const userRepository = getRepository(User);
        
        // Get all COMPANY users
        const companyUsers = await userRepository.find({
            where: { role: Roles.COMPANY },
            select: ['id', 'email', 'name', 'phone', 'verified', 'activated', 'createdAt'],
            order: { createdAt: 'DESC' },
        });

        console.log(`📊 Total COMPANY users: ${companyUsers.length}\n`);

        // Count verified and activated
        const verified = companyUsers.filter(u => u.verified).length;
        const activated = companyUsers.filter(u => u.activated).length;
        
        console.log(`✅ Verified: ${verified}`);
        console.log(`✅ Activated: ${activated}\n`);

        // Show recent accounts
        console.log('📋 Recent accounts (last 10):\n');
        companyUsers.slice(0, 10).forEach((user, index) => {
            console.log(`${index + 1}. ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Phone: ${user.phone || 'N/A'}`);
            console.log(`   Verified: ${user.verified ? '✅' : '❌'}`);
            console.log(`   Activated: ${user.activated ? '✅' : '❌'}`);
            console.log(`   Created: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}`);
            console.log('');
        });

        // Check for users without phone numbers
        const usersWithoutPhone = companyUsers.filter(u => !u.phone);
        if (usersWithoutPhone.length > 0) {
            console.log(`⚠️  Users without phone numbers: ${usersWithoutPhone.length}`);
        }

        // Check for unverified users
        const unverified = companyUsers.filter(u => !u.verified);
        if (unverified.length > 0) {
            console.log(`⚠️  Unverified users: ${unverified.length}`);
        }

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

verifyUserAccounts();

