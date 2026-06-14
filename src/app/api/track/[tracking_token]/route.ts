import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, services, orders, orderItems, tenants } from '@/db/schema';
import { createDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tracking_token: string }> }
) {
  const { tracking_token } = await params;
  try {
    const env = getCloudflareContext().env;
    const db = createDb(env);

    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.trackingToken, tracking_token))
      .limit(1);

    if (!order.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = order[0];

    const items = await db
      .select()
      .from(orderItems)
      .leftJoin(services, eq(orderItems.serviceId, services.id))
      .where(eq(orderItems.orderId, orderData.id));

    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, orderData.customerId))
      .limit(1);

    const tenant = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, orderData.tenantId))
      .limit(1);

    return NextResponse.json({
      order: orderData,
      customer: customer[0],
      tenant: tenant[0] || null,
      items: items.map((item) => ({
        ...item.order_items,
        serviceName: item.services?.serviceName,
        serviceType: item.services?.type,
        pricePerUnit: item.services?.pricePerUnit,
      })),
    });
  } catch (error) {
    console.error('Error fetching tracking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
