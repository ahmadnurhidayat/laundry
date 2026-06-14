import { Plus } from 'lucide-react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers } from '@/db/schema';
import { createDb } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { StatsOverview } from '@/features/orders/components/StatsOverview';
import { OrderCard } from '@/features/orders/components/OrderCard';

export default async function DashboardPage() {
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';
  const userName = h.get('x-user-name') || 'User';

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

  const stats = {
    pending: allOrders.filter((o) => o.orderStatus === 'PENDING').length,
    processing: allOrders.filter((o) => o.orderStatus === 'PROCESSING').length,
    finished: allOrders.filter((o) => o.orderStatus === 'FINISHED').length,
    pickedUp: allOrders.filter((o) => o.orderStatus === 'PICKED_UP').length,
    unpaid: allOrders.filter((o) => o.paymentStatus === 'UNPAID').length,
  };

  const recentOrders = allOrders
    .sort((a, b) => new Date(b.dateIn).getTime() - new Date(a.dateIn).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Selamat datang kembali, {userName}</p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Pesanan Baru
          </Button>
        </Link>
      </div>

      <StatsOverview stats={stats} />

      {recentOrders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h2>
            <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} customerName={customerMap.get(order.customerId)} />
            ))}
          </div>
        </section>
      )}

      {allOrders.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-gray-500 text-lg mb-4">Belum ada pesanan</p>
            <Link href="/dashboard/orders/new">
              <Button>Buat Pesanan Pertama</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
