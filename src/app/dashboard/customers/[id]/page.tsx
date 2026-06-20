import Link from 'next/link';
import { headers } from 'next/headers';
import { eq, and, desc, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, orders } from '@/db/schema';
import { createDb } from '@/lib/db';
import { ArrowLeft, ShoppingBag, CreditCard, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateShort, isRecentlyActive } from '@/lib/utils';
import { CustomerForm } from '@/features/customers/components/CustomerForm';

const statusConfig = {
  PENDING: { label: 'Menunggu', variant: 'warning' as const },
  PROCESSING: { label: 'Diproses', variant: 'info' as const },
  FINISHED: { label: 'Selesai', variant: 'success' as const },
  PICKED_UP: { label: 'Diambil', variant: 'neutral' as const },
};

const paymentConfig = {
  UNPAID: { label: 'Belum Bayar', variant: 'danger' as const },
  PAID: { label: 'Lunas', variant: 'success' as const },
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';

  let customer: any = null;
  let stats: any = null;
  let recentOrders: any[] = [];

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env);

    const customerResult = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, id), eq(customers.tenantId, tenantId)))
      .limit(1);

    if (!customerResult.length) return notFound();
    customer = customerResult[0];

    // Get stats
    const statsResult = await db
      .select({
        totalOrders: sql<number>`count(${orders.id})`,
        totalSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
        lastOrderDate: sql<string>`max(${orders.dateIn})`,
      })
      .from(orders)
      .where(eq(orders.customerId, id));

    stats = statsResult[0];

    // Get recent orders
    recentOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, id))
      .orderBy(desc(orders.dateIn))
      .limit(10);
  } catch (e) {
    console.error('Error:', e);
    return notFound();
  }

  if (!customer) return notFound();

  const isActive = stats.lastOrderDate && isRecentlyActive(stats.lastOrderDate);
  const avgOrderValue = stats.totalOrders > 0 ? stats.totalSpent / stats.totalOrders : 0;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center text-sm text-body-mid hover:text-ink transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Pelanggan
      </Link>

      {/* Customer Header */}
      <div className="bg-canvas rounded-xl border border-muted p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-xl">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-ink">{customer.name}</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : stats.totalOrders === 0
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? 'bg-emerald-500' : stats.totalOrders === 0 ? 'bg-gray-400' : 'bg-amber-500'
                }`} />
                {isActive ? 'Aktif' : stats.totalOrders === 0 ? 'Baru' : 'Diam'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-body">
              {customer.createdAt && (
                <span className="flex items-center gap-1.5">
                  Terdaftar {formatDateShort(customer.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-canvas rounded-xl border border-muted p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-body-mid">Total Pesanan</span>
          </div>
          <p className="text-2xl font-bold text-ink">{stats.totalOrders}</p>
        </div>

        <div className="bg-canvas rounded-xl border border-muted p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <CreditCard className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-body-mid">Total Belanja</span>
          </div>
          <p className="text-2xl font-bold text-ink">{formatCurrency(stats.totalSpent)}</p>
        </div>

        <div className="bg-canvas rounded-xl border border-muted p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <CreditCard className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-body-mid">Rata-rata</span>
          </div>
          <p className="text-2xl font-bold text-ink">{formatCurrency(avgOrderValue)}</p>
        </div>

        <div className="bg-canvas rounded-xl border border-muted p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-amber-50 rounded-lg">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-body-mid">Pesanan Terakhir</span>
          </div>
          <p className="text-lg font-bold text-ink">
            {stats.lastOrderDate ? formatDateShort(stats.lastOrderDate) : '-'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editable Customer Form */}
        <CustomerForm customer={customer} totalOrders={stats.totalOrders} />

        {/* Order History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink">Riwayat Pesanan</h2>
            <Link
              href="/dashboard/orders"
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              Lihat Semua
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="bg-canvas rounded-xl border border-muted overflow-hidden">
              {recentOrders.map((order) => {
                const status = statusConfig[order.orderStatus as keyof typeof statusConfig];
                const payment = paymentConfig[order.paymentStatus as keyof typeof paymentConfig];
                return (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-canvas-soft/50 transition-colors border-b border-muted/50 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-ink text-sm">{order.invoiceNumber}</p>
                      <p className="text-xs text-body-mid">{formatDateShort(order.dateIn)}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="text-sm font-semibold text-ink">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-canvas rounded-xl border border-muted p-8 text-center">
              <ShoppingBag className="h-10 w-10 text-muted mx-auto mb-3" />
              <p className="text-ink font-medium mb-1">Belum ada pesanan</p>
              <p className="text-sm text-body-mid">Pesanan pelanggan ini akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
