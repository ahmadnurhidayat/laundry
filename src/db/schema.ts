import { sqliteTable, text, real, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ── Tenants ──────────────────────────────────────────────
export const tenants = sqliteTable('tenants', {
  id: text('id').primaryKey(),
  businessName: text('business_name').notNull(),
  slug: text('slug').notNull().unique(),
  address: text('address'),
  phone: text('phone'),
  termsAndConditions: text('terms_and_conditions'),
  status: text('status', { enum: ['ACTIVE', 'SUSPENDED'] }).notNull().default('ACTIVE'),
  createdAt: text('created_at').notNull(),
});

// ── Users ────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  phone: text('phone').notNull(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['OWNER', 'CASHIER'] }).notNull().default('CASHIER'),
}, (t) => ({
  phoneIdx: uniqueIndex('users_phone_idx').on(t.phone),
}));

// ── Customers ────────────────────────────────────────────
export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  address: text('address'),
  notes: text('notes'),
  createdAt: text('created_at'),
}, (t) => ({
  tenantPhoneIdx: uniqueIndex('customers_tenant_phone_idx').on(t.tenantId, t.phoneNumber),
}));

// ── Services ─────────────────────────────────────────────
export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  serviceName: text('service_name').notNull(),
  description: text('description'),
  type: text('type', { enum: ['KILOAN', 'SATUAN'] }).notNull(),
  pricePerUnit: real('price_per_unit').notNull(),
  minWeight: real('min_weight').default(0),
  isActive: real('is_active').default(1),
  sortOrder: real('sort_order').default(0),
});

// ── Orders ───────────────────────────────────────────────
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  invoiceNumber: text('invoice_number').notNull(),
  customerId: text('customer_id').notNull().references(() => customers.id),
  dateIn: text('date_in').notNull(),
  dateEstimated: text('date_estimated').notNull(),
  orderStatus: text('order_status', { enum: ['PENDING', 'PROCESSING', 'FINISHED', 'PICKED_UP'] }).notNull().default('PENDING'),
  paymentStatus: text('payment_status', { enum: ['UNPAID', 'PAID'] }).notNull().default('UNPAID'),
  totalAmount: real('total_amount').notNull().default(0),
  notes: text('notes'),
  trackingToken: text('tracking_token').notNull().unique(),
}, (t) => ({
  tenantInvoiceIdx: uniqueIndex('orders_tenant_invoice_idx').on(t.tenantId, t.invoiceNumber),
}));

// ── Order Items ──────────────────────────────────────────
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  serviceId: text('service_id').notNull().references(() => services.id),
  qty: real('qty').notNull(),
  subtotal: real('subtotal').notNull(),
});

// ── Order Status History ─────────────────────────────────
export const orderStatusHistory = sqliteTable('order_status_history', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  status: text('status').notNull(),
  note: text('note'),
  updatedBy: text('updated_by'),
  createdAt: text('created_at').notNull(),
});

// ── Order Photos ─────────────────────────────────────────
export const orderPhotos = sqliteTable('order_photos', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  url: text('url').notNull(),
  caption: text('caption'),
  sortOrder: real('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

// ── Relations ────────────────────────────────────────────
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  customers: many(customers),
  services: many(services),
  orders: many(orders),
}));

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, { fields: [users.tenantId], references: [tenants.id] }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  tenant: one(tenants, { fields: [customers.tenantId], references: [tenants.id] }),
  orders: many(orders),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  tenant: one(tenants, { fields: [services.tenantId], references: [tenants.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  tenant: one(tenants, { fields: [orders.tenantId], references: [tenants.id] }),
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  photos: many(orderPhotos),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  service: one(services, { fields: [orderItems.serviceId], references: [services.id] }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, { fields: [orderStatusHistory.orderId], references: [orders.id] }),
}));

export const orderPhotosRelations = relations(orderPhotos, ({ one }) => ({
  order: one(orders, { fields: [orderPhotos.orderId], references: [orders.id] }),
}));
