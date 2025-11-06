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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = checkAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { brand, model, year, pricePerDay, licensePlate, imageUrl, isAvailable } = body;

    const updateData: any = {};
    if (brand !== undefined) updateData.brand = brand;
    if (model !== undefined) updateData.model = model;
    if (year !== undefined) updateData.year = year;
    if (pricePerDay !== undefined) updateData.pricePerDay = pricePerDay;
    if (licensePlate !== undefined) updateData.licensePlate = licensePlate;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    const [updatedCar] = await db
      .update(cars)
      .set(updateData)
      .where(eq(cars.id, parseInt(id)))
      .returning();

    if (!updatedCar) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Car updated successfully',
      car: updatedCar,
    });

  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json(
      { error: 'Failed to update car' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = checkAdmin(request);
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: authCheck.error },
        { status: 403 }
      );
    }

    const { id } = await params;

    const [deletedCar] = await db
      .delete(cars)
      .where(eq(cars.id, parseInt(id)))
      .returning();

    if (!deletedCar) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Car deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { error: 'Failed to delete car' },
      { status: 500 }
    );
  }
}
