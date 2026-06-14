import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, orders, orderItems, services } from '@/db/schema';
import { createDb } from '@/db/index';
import { generateId, generateTrackingToken, generateInvoiceNumber } from '@/lib/utils';

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);

    const allOrders = await db.select().from(orders);
    const allCustomers = await db.select().from(customers);

    const customerMap = new Map(allCustomers.map((c) => [c.id, c.name]));

    const ordersWithNames = allOrders.map((o) => ({
      ...o,
      customerName: customerMap.get(o.customerId) || 'Unknown',
    }));

    return NextResponse.json({ orders: ordersWithNames });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);
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

    let existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.phoneNumber, customerPhone))
      .limit(1);

    let customerId: string;
    if (existingCustomer.length > 0) {
      customerId = existingCustomer[0].id;
    } else {
      customerId = generateId();
      await db.insert(customers).values({
        id: customerId,
        name: customerName,
        phoneNumber: customerPhone,
      });
    }

    const allServices = await db.select().from(services);
    const serviceMap = new Map(allServices.map((s) => [s.id, s]));

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

export async function PATCH(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);
    const body = await request.json() as { orderId?: string; status?: string };
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    await db.update(orders).set({ orderStatus: status }).where(eq(orders.id, orderId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
