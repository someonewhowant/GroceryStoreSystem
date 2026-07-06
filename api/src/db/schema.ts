import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const items = sqliteTable('items', {
  barcode: text('barcode').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: integer('price').notNull(), // stored in cents
});

export const inventory = sqliteTable('inventory', {
  barcode: text('barcode')
    .primaryKey()
    .references(() => items.barcode, { onDelete: 'cascade' }),
  stockCount: integer('stock_count').notNull().default(0),
});

export const discountCampaigns = sqliteTable('discount_campaigns', {
  id: text('id').primaryKey(), // UUID
  name: text('name').notNull(),
  criteria: text('criteria', { mode: 'json' }).notNull(),
  strategy: text('strategy', { mode: 'json' }).notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), // UUID
  status: text('status').notNull().default('PENDING'), // PENDING | COMPLETED
  paymentAmount: integer('payment_amount').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  barcode: text('barcode')
    .notNull()
    .references(() => items.barcode),
  quantity: integer('quantity').notNull(),
  priceAtCheckout: integer('price_at_checkout').notNull(), // original price at checkout
  discountApplied: text('discount_applied', { mode: 'json' }), // applied discount info
});
