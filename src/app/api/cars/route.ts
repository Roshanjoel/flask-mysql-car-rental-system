import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { cars } from '@/db/schema';
import { eq, like, and, gte, lte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const availableOnly = searchParams.get('available') === 'true';
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let query = db.select().from(cars);
    const conditions = [];

    if (availableOnly) {
      conditions.push(eq(cars.isAvailable, true));
    }

    if (brand) {
      conditions.push(like(cars.brand, `%${brand}%`));
    }

    if (minPrice) {
      conditions.push(gte(cars.pricePerDay, parseFloat(minPrice)));
    }

    if (maxPrice) {
      conditions.push(lte(cars.pricePerDay, parseFloat(maxPrice)));
    }

    const result = conditions.length > 0 
      ? await query.where(and(...conditions))
      : await query;

    return NextResponse.json({ cars: result });

  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}
