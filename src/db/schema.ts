import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

export const cars = sqliteTable('cars', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  pricePerDay: real('price_per_day').notNull(),
  imageUrl: text('image_url'),
  isAvailable: integer('is_available', { mode: 'boolean' }).default(true),
  licensePlate: text('license_plate').notNull().unique(),
  createdAt: text('created_at').notNull(),
});

export const rentals = sqliteTable('rentals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerId: integer('customer_id').references(() => customers.id),
  carId: integer('car_id').references(() => cars.id),
  rentDate: text('rent_date').notNull(),
  returnDate: text('return_date'),
  totalPrice: real('total_price'),
  status: text('status').notNull().default('active'),
  createdAt: text('created_at').notNull(),
});