import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cars } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [car] = await db.select().from(cars).where(eq(cars.id, parseInt(id)));

    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ car });

  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { error: 'Failed to fetch car details' },
      { status: 500 }
    );
  }
}
