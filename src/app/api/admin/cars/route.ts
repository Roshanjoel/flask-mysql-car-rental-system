import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cars } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth';

function checkAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return { authorized: false, error: 'Unauthorized' };
  }

  const payload = verifyToken(token);
  if (!payload || !payload.isAdmin) {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true, payload };
}

export async function POST(request: NextRequest) {
  try {
    const authCheck = checkAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { brand, model, year, pricePerDay, licensePlate, imageUrl } = body;

    if (!brand || !model || !year || !pricePerDay || !licensePlate) {
      return NextResponse.json(
        { error: 'Brand, model, year, price per day, and license plate are required' },
        { status: 400 }
      );
    }

    const [newCar] = await db.insert(cars).values({
      brand,
      model,
      year,
      pricePerDay,
      licensePlate,
      imageUrl: imageUrl || null,
      isAvailable: true,
      createdAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json({
      message: 'Car added successfully',
      car: newCar,
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding car:', error);
    return NextResponse.json(
      { error: 'Failed to add car' },
      { status: 500 }
    );
  }
}
