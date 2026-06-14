import { Plus } from 'lucide-react';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers } from '@/db/schema';
import { createDb } from '@/db/index';
import { StatsMatrix } from '@/components/dashboard/stats-matrix';
import { OrderCard } from '@/components/dashboard/order-card';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  let allOrders: any[] = [];
  let customerMap = new Map<string, string>();

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);
    allOrders = await db.select().from(orders);
    const allCustomers = await db.select().from(customers);
    customerMap = new Map(allCustomers.map((c: any) => [c.id, c.name]));
  } catch (e) {
    console.error('Error:', e);
  }

  const stats = {
    pending: allOrders.filter((o) => o.orderStatus === 'PENDING').length,
    processing: allOrders.filter((o) => o.orderStatus === 'PROCESSING').length,
    finished: allOrders.filter((o) => o.orderStatus === 'FINISHED').length,
    pickedUp: allOrders.filter((o) => o.orderStatus === 'PICKED_UP').length,
    unpaid: allOrders.filter((o) => o.paymentStatus === 'UNPAID').length,
  };

  const activeOrders = allOrders.filter((o) =>
    ['PROCESSING', 'FINISHED', 'PICKED_UP'].includes(o.orderStatus)
  );
  const pendingOrders = allOrders.filter((o) => o.orderStatus === 'PENDING');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back to Daya Laundry</p>
        </div>
        <Link href="/orders/new">
          <Button size="lg" className="mt-4 md:mt-0">
            <Plus className="h-5 w-5 mr-2" />
            Create New Order
          </Button>
        </Link>
      </div>

      <StatsMatrix stats={stats} />

      {activeOrders.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} customerName={customerMap.get(order.customerId)} />
            ))}
          </div>
        </section>
      )}

      {pendingOrders.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Orders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} customerName={customerMap.get(order.customerId)} />
            ))}
          </div>
        </section>
      )}

      {allOrders.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No orders yet. Create your first order!</p>
        </div>
      )}
    </div>
  );
}
