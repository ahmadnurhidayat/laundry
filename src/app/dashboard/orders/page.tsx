import Link from 'next/link';
import { Plus } from 'lucide-react';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers } from '@/db/schema';
import { createDb } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { OrdersList } from '@/features/orders/components/OrdersList';

export default async function OrdersPage() {
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';

  let allOrders: any[] = [];
  let customerMap = new Map<string, string>();

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env);

    allOrders = await db.select().from(orders).where(eq(orders.tenantId, tenantId));
    const tenantCustomers = await db.select().from(customers).where(eq(customers.tenantId, tenantId));
    customerMap = new Map(tenantCustomers.map((c: any) => [c.id, c.name]));
  } catch (e) {
    console.error('Error:', e);
  }

  const ordersWithNames = allOrders.map((o) => ({
    ...o,
    customerName: customerMap.get(o.customerId) || 'Unknown',
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Pesanan</h1>
          <p className="text-body mt-1">{allOrders.length} total pesanan</p>
        </div>
        <Link href="/dashboard/orders/new" className="hidden sm:inline-flex">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Pesanan Baru
          </Button>
        </Link>
      </div>

      <OrdersList orders={ordersWithNames} />
    </div>
  );
}
