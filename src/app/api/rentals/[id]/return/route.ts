import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rentals, cars } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { returnDate } = body;

    if (!returnDate) {
      return NextResponse.json(
        { error: 'Return date is required' },
        { status: 400 }
      );
    }

    // Find rental
    const [rental] = await db
      .select()
      .from(rentals)
      .where(
        and(
          eq(rentals.id, parseInt(id)),
          eq(rentals.customerId, payload.userId),
          eq(rentals.status, 'active')
        )
      );

    if (!rental) {
      return NextResponse.json(
        { error: 'Active rental not found' },
        { status: 404 }
      );
    }

    // Update rental
    const [updatedRental] = await db
      .update(rentals)
      .set({
        returnDate,
        status: 'completed',
      })
      .where(eq(rentals.id, parseInt(id)))
      .returning();

    // Update car availability
    await db
      .update(cars)
      .set({ isAvailable: true })
      .where(eq(cars.id, rental.carId));

    return NextResponse.json({
      message: 'Car returned successfully',
      rental: updatedRental,
    });

  } catch (error) {
    console.error('Error returning car:', error);
    return NextResponse.json(
      { error: 'Failed to return car. Please try again.' },
      { status: 500 }
    );
  }
}
