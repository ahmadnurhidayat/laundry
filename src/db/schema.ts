import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull().unique(),
});

export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  serviceName: text('service_name').notNull(),
  type: text('type').notNull(),
  pricePerUnit: real('price_per_unit').notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  customerId: text('customer_id').notNull(),
  dateIn: text('date_in').notNull(),
  dateEstimated: text('date_estimated').notNull(),
  orderStatus: text('order_status').notNull().default('PENDING'),
  paymentStatus: text('payment_status').notNull().default('UNPAID'),
  totalAmount: real('total_amount').notNull().default(0),
  notes: text('notes'),
  trackingToken: text('tracking_token').notNull().unique(),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull(),
  serviceId: text('service_id').notNull(),
  qty: real('qty').notNull(),
  subtotal: real('subtotal').notNull(),
});
