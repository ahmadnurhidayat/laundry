import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services, tenants } from '@/db/schema';
import { createDb } from '@/lib/db';
import { TrackingView } from '@/components/tracking/tracking-view';

export default async function TrackingPage({ params }: { params: Promise<{ tracking_token: string }> }) {
  const { tracking_token } = await params;
  let order: any = null;
  let customer: any = null;
  let items: any[] = [];
  let tenantData: any = null;

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env);

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

    const tenantResult = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, order.tenantId))
      .limit(1);
    tenantData = tenantResult[0];

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

  return (
    <TrackingView
      order={order}
      customer={customer}
      items={items}
      tenant={tenantData ? { name: tenantData.businessName, phone: tenantData.phone } : undefined}
    />
  );
}
