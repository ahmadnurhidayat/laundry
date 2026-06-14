import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, services, orders, orderItems } from '@/db/schema';
import { createDb } from '@/db/index';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tracking_token: string }> }
) {
  const { tracking_token } = await params;
  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);

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

    return NextResponse.json({
      order: orderData,
      customer: customer[0],
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
