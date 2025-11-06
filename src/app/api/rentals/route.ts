import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rentals, cars, customers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
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
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { carId, rentDate, days } = body;

    if (!carId || !rentDate || !days) {
      return NextResponse.json(
        { error: 'Car ID, rent date, and number of days are required' },
        { status: 400 }
      );
    }

    if (days < 1) {
      return NextResponse.json(
        { error: 'Rental period must be at least 1 day' },
        { status: 400 }
      );
    }

    // Check if car exists and is available
    const [car] = await db.select().from(cars).where(eq(cars.id, carId));

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    if (!car.isAvailable) {
      return NextResponse.json(
        { error: 'Car is not available for rent' },
        { status: 400 }
      );
    }

    // Calculate total price
    const totalPrice = car.pricePerDay * days;

    // Create rental
    const [newRental] = await db.insert(rentals).values({
      customerId: payload.userId,
      carId,
      rentDate,
      returnDate: null,
      totalPrice,
      status: 'active',
      createdAt: new Date().toISOString(),
    }).returning();

    // Update car availability
    await db.update(cars)
      .set({ isAvailable: false })
      .where(eq(cars.id, carId));

    return NextResponse.json({
      message: 'Car rented successfully',
      rental: newRental,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating rental:', error);
    return NextResponse.json(
      { error: 'Failed to rent car. Please try again.' },
      { status: 500 }
    );
  }
}

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
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user's rentals with car details
    const userRentals = await db
      .select({
        id: rentals.id,
        rentDate: rentals.rentDate,
        returnDate: rentals.returnDate,
        totalPrice: rentals.totalPrice,
        status: rentals.status,
        createdAt: rentals.createdAt,
        car: {
          id: cars.id,
          brand: cars.brand,
          model: cars.model,
          year: cars.year,
          pricePerDay: cars.pricePerDay,
          licensePlate: cars.licensePlate,
          imageUrl: cars.imageUrl,
        },
      })
      .from(rentals)
      .leftJoin(cars, eq(rentals.carId, cars.id))
      .where(eq(rentals.customerId, payload.userId));

    return NextResponse.json({ rentals: userRentals });

  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rentals' },
      { status: 500 }
    );
  }
}
