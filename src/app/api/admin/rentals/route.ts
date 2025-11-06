import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rentals, cars, customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all rentals with car and customer details
    const allRentals = await db
      .select({
        id: rentals.id,
        rentDate: rentals.rentDate,
        returnDate: rentals.returnDate,
        totalPrice: rentals.totalPrice,
        status: rentals.status,
        createdAt: rentals.createdAt,
        customer: {
          id: customers.id,
          name: customers.name,
          email: customers.email,
          phone: customers.phone,
        },
        car: {
          id: cars.id,
          brand: cars.brand,
          model: cars.model,
          year: cars.year,
          licensePlate: cars.licensePlate,
          pricePerDay: cars.pricePerDay,
        },
      })
      .from(rentals)
      .leftJoin(customers, eq(rentals.customerId, customers.id))
      .leftJoin(cars, eq(rentals.carId, cars.id));

    return NextResponse.json({ rentals: allRentals });

  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    );
  }
}
