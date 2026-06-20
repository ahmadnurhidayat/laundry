import { Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers } from '@/db/schema';
import { createDb } from '@/lib/db';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
          <p className="text-body mt-1">Selamat datang kembali, {userName}</p>
        </div>
        <Link href="/dashboard/orders/new" className="hidden sm:inline-flex">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Pesanan Baru
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <StatsOverview stats={stats} />

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink">Pesanan Terbaru</h2>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium group"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} customerName={customerMap.get(order.customerId)} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {allOrders.length === 0 && (
        <div className="bg-canvas rounded-xl border border-muted p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-7 w-7 text-primary" />
          </div>
          <h3 className="text-ink font-semibold mb-1">Belum ada pesanan</h3>
          <p className="text-sm text-body-mid mb-4">Mulai dengan membuat pesanan pertama Anda</p>
          <Link href="/dashboard/orders/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Buat Pesanan
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
