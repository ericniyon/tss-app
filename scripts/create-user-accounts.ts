import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { createConnection, getRepository } from 'typeorm';
import { Membership } from '../src/membership/entities/membership.entity';
import { User } from '../src/users/entities/user.entity';
import { Roles } from '../src/shared/enums/roles.enum';

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
}

function formatPhoneNumber(phone: string | number | null | undefined): string | null {
    if (!phone) return null;
    
    let phoneStr = String(phone).trim();
    
    // Remove any non-digit characters except +
    phoneStr = phoneStr.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add +250 (Rwanda country code)
    if (!phoneStr.startsWith('+')) {
        // Remove leading zeros
        phoneStr = phoneStr.replace(/^0+/, '');
        
        // If it starts with 250, add +
        if (phoneStr.startsWith('250')) {
            phoneStr = '+' + phoneStr;
        } else {
            // Assume it's a local number, add +250
            phoneStr = '+250' + phoneStr;
        }
    }
    
    // Ensure minimum length (at least +250 + 9 digits)
    if (phoneStr.length < 13) {
        return null;
    }
    
    return phoneStr;
}

function generateUserName(membership: Membership): string {
    // Use company name, or combine last name + company name if available
    if (membership.lastName && membership.lastName.trim() !== '') {
        return `${membership.lastName.trim()} - ${membership.companyName}`;
    }
    return membership.companyName;
}

function isValidEmail(email: string | null | undefined): boolean {
    if (!email || email.trim() === '') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

async function createUserAccounts() {
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

        const membershipRepository = getRepository(Membership);
        const userRepository = getRepository(User);

        // Get all memberships with emails
        const memberships = await membershipRepository.find({
            where: {},
            order: { id: 'ASC' },
        });

        console.log(`📋 Found ${memberships.length} memberships\n`);
        console.log('👤 Creating user accounts...\n');

        let created = 0;
        let updated = 0;
        let skipped = 0;
        let errors = 0;

        for (const membership of memberships) {
            try {
                // Skip if no email
                if (!isValidEmail(membership.email)) {
                    skipped++;
                    continue;
                }

                const email = membership.email.trim().toLowerCase();
                
                // Check if user already exists
                const existingUser = await userRepository.findOne({
                    where: { email },
                });

                // Format phone number
                const phone = formatPhoneNumber(membership.phoneNumber);
                
                // Use phone number as password, or skip if no valid phone
                if (!phone) {
                    console.log(`⚠️  Skipping ${email}: No valid phone number`);
                    skipped++;
                    continue;
                }

                const password = await hashPassword(phone);
                const name = generateUserName(membership);

                if (existingUser) {
                    // Update existing user if needed
                    const needsUpdate = 
                        existingUser.name !== name ||
                        existingUser.phone !== phone ||
                        !existingUser.verified ||
                        !existingUser.activated;

                    if (needsUpdate) {
                        existingUser.name = name;
                        existingUser.phone = phone;
                        existingUser.verified = true;
                        existingUser.activated = true;
                        // Update password to phone number
                        existingUser.password = password;
                        await userRepository.save(existingUser);
                        updated++;
                        console.log(`🔄 Updated: ${email}`);
                    } else {
                        skipped++;
                    }
                } else {
                    // Create new user
                    const user = userRepository.create({
                        email,
                        name,
                        phone,
                        password,
                        verified: true,
                        activated: true,
                        role: Roles.COMPANY,
                    });

                    await userRepository.save(user);
                    created++;
                    console.log(`✅ Created: ${email} (${name})`);
                }
            } catch (error: any) {
                errors++;
                console.error(`❌ Error processing ${membership.email}:`, error.message);
                
                // Handle unique constraint violations
                if (error.code === '23505') {
                    // Duplicate key error
                    if (error.detail?.includes('email')) {
                        console.log(`   ⚠️  Email already exists: ${membership.email}`);
                    } else if (error.detail?.includes('phone')) {
                        console.log(`   ⚠️  Phone already exists: ${membership.phoneNumber}`);
                    }
                }
            }
        }

        console.log('\n✅ Account creation completed!');
        console.log(`   📝 Created: ${created}`);
        console.log(`   🔄 Updated: ${updated}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   ❌ Errors: ${errors}`);
        console.log(`   📊 Total processed: ${created + updated + skipped + errors}`);

        const totalUsers = await userRepository.count();
        console.log(`\n📊 Total users in database: ${totalUsers}`);

        // Show sample of created users
        const sampleUsers = await userRepository.find({
            where: { role: Roles.COMPANY },
            take: 5,
            order: { id: 'DESC' },
            select: ['id', 'email', 'name', 'phone', 'verified', 'activated'],
        });

        if (sampleUsers.length > 0) {
            console.log('\n📋 Sample of created users:');
            sampleUsers.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.name}`);
                console.log(`      Email: ${user.email}`);
                console.log(`      Phone: ${user.phone || 'N/A'}`);
                console.log(`      Verified: ${user.verified ? 'Yes' : 'No'}`);
                console.log('');
            });
        }

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

createUserAccounts();

