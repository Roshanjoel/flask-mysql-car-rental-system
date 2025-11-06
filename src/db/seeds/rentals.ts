import { db } from '@/db';
import { rentals } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const sampleRentals = [
        // Active Rentals
        {
            customerId: 2,
            carId: 3,
            rentDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: null,
            totalPrice: 475.00,
            status: 'active',
            createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            customerId: 3,
            carId: 5,
            rentDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: null,
            totalPrice: 264.00,
            status: 'active',
            createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            customerId: 4,
            carId: 8,
            rentDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: null,
            totalPrice: 840.00,
            status: 'active',
            createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        // Completed Rentals
        {
            customerId: 5,
            carId: 1,
            rentDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            totalPrice: 225.00,
            status: 'completed',
            createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            customerId: 6,
            carId: 4,
            rentDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
            totalPrice: 550.00,
            status: 'completed',
            createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            customerId: 2,
            carId: 9,
            rentDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: new Date(now.getTime() - 57 * 24 * 60 * 60 * 1000).toISOString(),
            totalPrice: 120.00,
            status: 'completed',
            createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            customerId: 3,
            carId: 6,
            rentDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: new Date(now.getTime() - 17 * 24 * 60 * 60 * 1000).toISOString(),
            totalPrice: 225.00,
            status: 'completed',
            createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            customerId: 5,
            carId: 13,
            rentDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            returnDate: null,
            totalPrice: 82.00,
            status: 'active',
            createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(rentals).values(sampleRentals);
    
    console.log('✅ Rentals seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});