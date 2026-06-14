import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services, tenants } from '@/db/schema';
import { createDb } from '@/db/index';
import { Receipt } from '@/components/invoice/receipt';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';

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
      .where(and(eq(orders.id, id), eq(orders.tenantId, tenantId)))
      .limit(1);

    if (!orderResult.length) return notFound();
    order = orderResult[0];

    const customerResult = await db.select().from(customers).where(eq(customers.id, order.customerId)).limit(1);
    customer = customerResult[0];

    const tenantResult = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    tenantData = tenantResult[0];

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
          Cetak Struk
        </button>
      </div>
      <Receipt
        order={{ ...order, customer, items }}
        tenant={tenantData ? { name: tenantData.businessName, phone: tenantData.phone, address: tenantData.address } : undefined}
      />
    </div>
  );
}
