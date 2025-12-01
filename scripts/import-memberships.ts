import 'dotenv/config';
import axios from 'axios';
import { createConnection, getRepository } from 'typeorm';
import { Membership } from '../src/membership/entities/membership.entity';

interface MembershipData {
    'Membership IDs': string;
    'Company name': string;
    'Membership category': string;
    'Last Name': string;
    'Phone Number': string | number;
    'Email': string;
    'TIN Numbers': string | number;
    'Company website': string;
}

interface GoogleSheetResponse {
    data: MembershipData[];
    debugInfo?: string;
}

async function importMemberships() {
    const googleSheetUrl = process.env.GOOGLE_SHEET_URL || 
        'https://script.google.com/macros/s/AKfycbxeVt-S5gGlc4b2hxDEr00XZwWajWrnssezJqF9swyyNngGcMO3E9lYOnkHNNqY8TyG/exec?path=Sheet1&action=read';
    
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

        console.log('📥 Fetching data from Google Sheets...');
        const response = await axios.get<GoogleSheetResponse>(googleSheetUrl);
        
        if (!response.data || !response.data.data) {
            throw new Error('Invalid response from Google Sheets API');
        }

        const membershipsData = response.data.data;
        console.log(`✅ Fetched ${membershipsData.length} records from Google Sheets\n`);

        const membershipRepository = getRepository(Membership);

        // Check existing records
        const existingCount = await membershipRepository.count();
        console.log(`📊 Current records in database: ${existingCount}\n`);

        let created = 0;
        let updated = 0;
        let skipped = 0;

        console.log('💾 Importing memberships...\n');

        for (const data of membershipsData) {
            try {
                const membershipId = data['Membership IDs'] || 'N/A';
                
                // Skip if membership ID is empty or N/A
                if (!membershipId || membershipId === 'N/A' || membershipId.trim() === '') {
                    skipped++;
                    continue;
                }

                // Check if membership already exists
                const existing = await membershipRepository.findOne({
                    where: { membershipId: membershipId },
                });

                const membershipData = {
                    membershipId: membershipId,
                    companyName: data['Company name'] || '',
                    membershipCategory: data['Membership category'] || '',
                    lastName: data['Last Name'] || '',
                    phoneNumber: String(data['Phone Number'] || ''),
                    email: data['Email'] || '',
                    tinNumbers: data['TIN Numbers'] ? String(data['TIN Numbers']) : '',
                    companyWebsite: data['Company website'] || '',
                };

                if (existing) {
                    // Update existing record
                    await membershipRepository.update(existing.id, membershipData);
                    updated++;
                } else {
                    // Create new record
                    const membership = membershipRepository.create(membershipData);
                    await membershipRepository.save(membership);
                    created++;
                }
            } catch (error) {
                console.error(`❌ Error processing record: ${data['Company name']}`, error);
                skipped++;
            }
        }

        console.log('\n✅ Import completed!');
        console.log(`   📝 Created: ${created}`);
        console.log(`   🔄 Updated: ${updated}`);
        console.log(`   ⏭️  Skipped: ${skipped}`);
        console.log(`   📊 Total processed: ${created + updated + skipped}`);

        const finalCount = await membershipRepository.count();
        console.log(`\n📊 Total records in database: ${finalCount}`);

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

importMemberships();

