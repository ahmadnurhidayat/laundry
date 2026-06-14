import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services } from '@/db/schema';
import { createDb } from '@/db/index';
import { TrackingView } from '@/components/tracking/tracking-view';

export default async function TrackingPage({ params }: { params: Promise<{ tracking_token: string }> }) {
  const { tracking_token } = await params;
  let order: any = null;
  let customer: any = null;
  let items: any[] = [];

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);

    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.trackingToken, tracking_token))
      .limit(1);

    if (!orderResult.length) return notFound();
    order = orderResult[0];

    const customerResult = await db
      .select()
      .from(customers)
      .where(eq(customers.id, order.customerId))
      .limit(1);
    customer = customerResult[0];

    const itemsResult = await db
      .select()
      .from(orderItems)
      .leftJoin(services, eq(orderItems.serviceId, services.id))
      .where(eq(orderItems.orderId, order.id));

    items = itemsResult.map((item) => ({
      ...item.order_items,
      serviceName: item.services?.serviceName,
      serviceType: item.services?.type,
      pricePerUnit: item.services?.pricePerUnit,
    }));
  } catch (e) {
    console.error('Error:', e);
    return notFound();
  }

  if (!order || !customer) return notFound();

  return <TrackingView order={order} customer={customer} items={items} />;
}
