import { Plus, ArrowRight, ShoppingBag, User, Phone, Eye } from 'lucide-react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { eq, count, desc } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers } from '@/db/schema';
import { createDb } from '@/lib/db';
import { StatsOverview } from '@/features/orders/components/StatsOverview';
import { OrderCard } from '@/features/orders/components/OrderCard';

export default async function DashboardPage() {
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';
  const userName = h.get('x-user-name') || 'User';

  let allOrders: any[] = [];
  let customerMap = new Map<string, string>();
  let customersWithStats: any[] = [];

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env);

    allOrders = await db.select().from(orders).where(eq(orders.tenantId, tenantId));
    const tenantCustomers = await db.select().from(customers).where(eq(customers.tenantId, tenantId));
    customerMap = new Map(tenantCustomers.map((c: any) => [c.id, c.name]));

    // Get customer stats (total orders, total spend)
    customersWithStats = tenantCustomers.slice(0, 3).map((customer: any) => {
      const customerOrders = allOrders.filter((o) => o.customerId === customer.id);
      const totalOrders = customerOrders.length;
      const totalSpend = customerOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
      const lastOrder = customerOrders.sort((a: any, b: any) => new Date(b.dateIn).getTime() - new Date(a.dateIn).getTime())[0];
      return {
        ...customer,
        totalOrders,
        totalSpend,
        lastOrderDate: lastOrder?.dateIn || null,
      };
    });
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
          <h1 className="text-2xl font-semibold text-ink">Beranda</h1>
          <p className="text-sm text-ink-muted mt-1">Ringkasan aktivitas laundry hari ini</p>
        </div>
        <Link href="/dashboard/orders/new" className="hidden sm:inline-flex">
          <button className="h-10 px-4 bg-brand text-white rounded-lg font-medium text-sm hover:bg-brand-hover active:scale-[0.98] transition-all duration-150 flex items-center gap-2 shadow-premium-sm">
            <Plus className="h-4 w-4" />
            Pesanan Baru
          </button>
        </Link>
      </div>

      {/* Stats */}
      <StatsOverview stats={stats} />

      {/* Customer Cards */}
      {customersWithStats.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink border-l-4 border-brand pl-3">Pelanggan Terbaru</h2>
            <Link
              href="/dashboard/customers"
              className="flex items-center gap-1 text-sm text-brand hover:text-brand-hover font-medium group"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customersWithStats.map((customer) => (
              <div key={customer.id} className="bg-canvas-elevated rounded-2xl border border-border-subtle p-4 hover:shadow-premium-sm transition-all duration-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center border border-brand/20 flex-shrink-0">
                    <User className="h-6 w-6 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-ink truncate">{customer.name}</h3>
                      <div className="h-2 w-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                    </div>
                    <p className="text-sm text-ink-muted flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {customer.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-canvas rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-ink-muted">Order</p>
                    <p className="font-semibold text-ink">{customer.totalOrders}</p>
                  </div>
                  <div className="text-center border-x border-border-subtle">
                    <p className="text-xs text-ink-muted">Total</p>
                    <p className="font-semibold text-ink">Rp {(customer.totalSpend / 1000).toFixed(0)}k</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-ink-muted">Terakhir</p>
                    <p className="font-semibold text-ink text-xs">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/customers/${customer.id}`} className="flex-1">
                    <button className="w-full h-9 bg-brand/10 text-brand rounded-xl text-sm font-medium hover:bg-brand/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      Lihat
                    </button>
                  </Link>
                  <Link href={`/dashboard/orders/new?customerId=${customer.id}`} className="flex-1">
                    <button className="w-full h-9 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-hover active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5">
                      <Plus className="h-4 w-4" />
                      Order
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink border-l-4 border-brand pl-3">Pesanan Terbaru</h2>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 text-sm text-brand hover:text-brand-hover font-medium group"
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
        <div className="bg-canvas-elevated rounded-2xl border border-border-subtle p-8 text-center">
          <div className="h-14 w-14 bg-canvas rounded-full flex items-center justify-center mx-auto mb-4 border border-border-subtle">
            <ShoppingBag className="h-7 w-7 text-ink-muted" />
          </div>
          <h3 className="text-ink font-semibold text-sm mb-1">Belum ada pesanan</h3>
          <p className="text-sm text-ink-muted mb-4">Mulai dengan membuat pesanan pertama Anda</p>
          <Link href="/dashboard/orders/new">
            <button className="h-9 px-4 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-hover active:scale-[0.98] transition-all duration-150 inline-flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Buat Pesanan
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
