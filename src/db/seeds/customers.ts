import { db } from '@/db';
import { customers } from '@/db/schema';

async function main() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const sampleCustomers = [
        {
            name: 'Admin User',
            email: 'admin@carrental.com',
            password: 'admin123',
            phone: '+1-555-0100',
            isAdmin: true,
            createdAt: sixMonthsAgo.toISOString(),
        },
        {
            name: 'John Smith',
            email: 'john.smith@email.com',
            password: 'customer123',
            phone: '+1-555-0101',
            isAdmin: false,
            createdAt: fourMonthsAgo.toISOString(),
        },
        {
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            password: 'customer123',
            phone: '+1-555-0102',
            isAdmin: false,
            createdAt: threeMonthsAgo.toISOString(),
        },
        {
            name: 'Michael Brown',
            email: 'michael.brown@email.com',
            password: 'customer123',
            phone: '+1-555-0103',
            isAdmin: false,
            createdAt: threeMonthsAgo.toISOString(),
        },
        {
            name: 'Emily Davis',
            email: 'emily.davis@email.com',
            password: 'customer123',
            phone: '+1-555-0104',
            isAdmin: false,
            createdAt: twoMonthsAgo.toISOString(),
        },
        {
            name: 'David Wilson',
            email: 'david.wilson@email.com',
            password: 'customer123',
            phone: '+1-555-0105',
            isAdmin: false,
            createdAt: oneMonthAgo.toISOString(),
        },
    ];

    await db.insert(customers).values(sampleCustomers);
    
    console.log('✅ Customers seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});