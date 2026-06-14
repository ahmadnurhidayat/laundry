import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services } from '@/db/schema';
import { createDb } from '@/db/index';
import { Receipt } from '@/components/invoice/receipt';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order: any = null;
  let customer: any = null;
  let items: any[] = [];

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);

    const orderResult = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!orderResult.length) return notFound();
    order = orderResult[0];

    const customerResult = await db.select().from(customers).where(eq(customers.id, order.customerId)).limit(1);
    customer = customerResult[0];

    const itemsResult = await db
      .select()
      .from(orderItems)
      .leftJoin(services, eq(orderItems.serviceId, services.id))
      .where(eq(orderItems.orderId, id));

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
    <div className="p-4">
      <div className="no-print mb-4 text-center">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Print Invoice
        </button>
      </div>
      <Receipt order={{ ...order, customer, items }} />
    </div>
  );
}
