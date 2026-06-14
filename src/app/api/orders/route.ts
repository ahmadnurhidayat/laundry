import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, orders, orderItems, services } from '@/db/schema';
import { createDb } from '@/db/index';
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
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as {
      customerName?: string;
      customerPhone?: string;
      items?: { serviceId: string; qty: number }[];
      notes?: string;
      daysEstimate?: number;
    };
    const { customerName, customerPhone, items, notes, daysEstimate } = body;

    if (!customerName || !customerPhone || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find or create customer within tenant
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
      });
    }

    // Get tenant services for price calculation
    const tenantServices = await db
      .select()
      .from(services)
      .where(eq(services.tenantId, ctx.tenantId));

    const serviceMap = new Map(tenantServices.map((s) => [s.id, s]));

    let totalAmount = 0;
    const orderItemsData = items.map((item) => {
      const service = serviceMap.get(item.serviceId);
      const subtotal = service ? service.pricePerUnit * item.qty : 0;
      totalAmount += subtotal;
      return {
        id: generateId(),
        serviceId: item.serviceId,
        qty: item.qty,
        subtotal,
      };
    });

    const orderId = generateId();
    const trackingToken = generateTrackingToken();
    const invoiceNumber = generateInvoiceNumber();

    const now = new Date();
    const dateIn = now.toISOString().split('T')[0];
    const estimated = new Date(now.getTime() + (daysEstimate || 3) * 24 * 60 * 60 * 1000)
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
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as { orderId?: string; status?: string };
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    await db
      .update(orders)
      .set({ orderStatus: status as 'PENDING' | 'PROCESSING' | 'FINISHED' | 'PICKED_UP' })
      .where(and(eq(orders.id, orderId), eq(orders.tenantId, ctx.tenantId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
