import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, orders, orderItems, services, orderStatusHistory } from '@/db/schema';
import { createDb } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant-context';

function generateId(): string {
  return crypto.randomUUID();
}

function generateTrackingToken(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 16);
}

function generateInvoiceNumber(): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0].replace(/-/g, '');
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${date}-${rand}`;
}

function sanitize(input: unknown, maxLength: number = 200): string {
  if (typeof input !== 'string') return '';
  let s = '';
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c !== '<' && c !== '>') s += c;
  }
  return s.trim().substring(0, maxLength);
}

export async function GET() {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);

    const tenantOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.tenantId, ctx.tenantId));

    const tenantCustomers = await db
      .select()
      .from(customers)
      .where(eq(customers.tenantId, ctx.tenantId));

    const customerMap = new Map(tenantCustomers.map((c) => [c.id, c.name]));

    const ordersWithNames = tenantOrders.map((o) => ({
      ...o,
      customerName: customerMap.get(o.customerId) || 'Unknown',
    }));

    return NextResponse.json({ orders: ordersWithNames });
  } catch {
    return NextResponse.json({ error: 'Gagal memuat pesanan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as Record<string, unknown>;

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const customerName = sanitize(body.customerName, 100);
    const customerPhone = sanitize(body.customerPhone, 15);
    const customerAddress = sanitize(body.customerAddress, 200);
    const customerNotes = sanitize(body.customerNotes, 500);
    const notes = sanitize(body.notes, 500);
    const items = Array.isArray(body.items) ? body.items : [];
    const daysEstimate = typeof body.daysEstimate === 'number' ? Math.min(Math.max(body.daysEstimate, 1), 30) : 3;

    if (!customerName || !customerPhone || !items.length) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    if (!/^[0-9]{10,15}$/.test(customerPhone)) {
      return NextResponse.json({ error: 'Nomor telepon tidak valid' }, { status: 400 });
    }

    const existingCustomer = await db
      .select()
      .from(customers)
      .where(
        and(
          eq(customers.tenantId, ctx.tenantId),
          eq(customers.phoneNumber, customerPhone)
        )
      )
      .limit(1);

    let customerId: string;
    if (existingCustomer.length > 0) {
      customerId = existingCustomer[0].id;
    } else {
      customerId = generateId();
      await db.insert(customers).values({
        id: customerId,
        tenantId: ctx.tenantId,
        name: customerName,
        phoneNumber: customerPhone,
        address: customerAddress || null,
        notes: customerNotes || null,
        createdAt: new Date().toISOString(),
      });
    }

    const tenantServices = await db
      .select()
      .from(services)
      .where(eq(services.tenantId, ctx.tenantId));

    const serviceMap = new Map(tenantServices.map((s) => [s.id, s]));

    let totalAmount = 0;
    const orderItemsData = items
      .filter((item: any) => item && typeof item.serviceId === 'string' && typeof item.qty === 'number' && item.qty > 0)
      .slice(0, 50)
      .map((item: any) => {
        const service = serviceMap.get(item.serviceId);
        const qty = Math.min(Math.max(Math.floor(item.qty), 1), 1000);
        const subtotal = service ? service.pricePerUnit * qty : 0;
        totalAmount += subtotal;
        return {
          id: generateId(),
          serviceId: item.serviceId,
          qty,
          subtotal,
        };
      });

    if (orderItemsData.length === 0) {
      return NextResponse.json({ error: 'Tidak ada item valid' }, { status: 400 });
    }

    const orderId = generateId();
    const trackingToken = generateTrackingToken();
    const invoiceNumber = generateInvoiceNumber();

    const now = new Date();
    const dateIn = now.toISOString().split('T')[0];
    const estimated = new Date(now.getTime() + daysEstimate * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    await db.insert(orders).values({
      id: orderId,
      tenantId: ctx.tenantId,
      invoiceNumber,
      customerId,
      dateIn,
      dateEstimated: estimated,
      orderStatus: 'PENDING',
      paymentStatus: 'UNPAID',
      totalAmount,
      notes: notes || null,
      trackingToken,
    });

    // Record initial status history
    await db.insert(orderStatusHistory).values({
      id: generateId(),
      orderId,
      status: 'PENDING',
      note: 'Pesanan diterima',
      updatedBy: ctx.name || null,
      createdAt: new Date().toISOString(),
    });

    for (const item of orderItemsData) {
      await db.insert(orderItems).values({
        id: item.id,
        orderId,
        serviceId: item.serviceId,
        qty: item.qty,
        subtotal: item.subtotal,
      });
    }

    return NextResponse.json({
      success: true,
      order: { id: orderId, invoiceNumber, trackingToken },
    });
  } catch {
    return NextResponse.json({ error: 'Gagal membuat pesanan' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as Record<string, unknown>;

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const orderId = typeof body.orderId === 'string' ? body.orderId : '';
    const status = typeof body.status === 'string' ? body.status : '';

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const validStatuses = ['PENDING', 'PROCESSING', 'FINISHED', 'PICKED_UP'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
    }

    // Get current order to check for status change
    const currentOrder = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.tenantId, ctx.tenantId)))
      .limit(1);

    if (currentOrder.length === 0) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // Only record history if status actually changed
    if (currentOrder[0].orderStatus !== status) {
      await db.insert(orderStatusHistory).values({
        id: generateId(),
        orderId,
        status,
        note: null,
        updatedBy: ctx.name || null,
        createdAt: new Date().toISOString(),
      });
    }

    await db
      .update(orders)
      .set({ orderStatus: status as 'PENDING' | 'PROCESSING' | 'FINISHED' | 'PICKED_UP' })
      .where(and(eq(orders.id, orderId), eq(orders.tenantId, ctx.tenantId)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui status' }, { status: 500 });
  }
}
