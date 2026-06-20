import Link from 'next/link';
import { headers } from 'next/headers';
import { eq, and, desc, sql } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, orders } from '@/db/schema';
import { createDb } from '@/lib/db';
import { ArrowLeft, Phone, MapPin, FileText, Calendar, ShoppingBag, CreditCard, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatDateShort, isRecentlyActive } from '@/lib/utils';

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
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-body-mid" />
                {customer.phoneNumber}
                <a
                  href={`https://wa.me/${customer.phoneNumber.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-medium ml-1"
                >
                  WhatsApp
                </a>
              </span>
              {customer.address && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-body-mid" />
                  {customer.address}
                </span>
              )}
              {customer.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-body-mid" />
                  Terdaftar {formatDateShort(customer.createdAt)}
                </span>
              )}
            </div>

            {customer.notes && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">Catatan</span>
                </div>
                <p className="text-sm text-amber-800">{customer.notes}</p>
              </div>
            )}
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

      {/* Order History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">Riwayat Pesanan</h2>
          <Link
            href={`/dashboard/orders?customer=${customer.id}`}
            className="text-sm text-primary hover:text-primary-hover font-medium"
          >
            Lihat Semua
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="bg-canvas rounded-xl border border-muted overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-canvas-soft border-b border-muted text-xs font-medium text-body-mid uppercase tracking-wider">
              <div className="col-span-3">Invoice</div>
              <div className="col-span-2">Tanggal</div>
              <div className="col-span-2">Estimasi</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Bayar</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Table Body */}
            {recentOrders.map((order) => {
              const status = statusConfig[order.orderStatus as keyof typeof statusConfig];
              const payment = paymentConfig[order.paymentStatus as keyof typeof paymentConfig];
              return (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block hover:bg-canvas-soft/50 transition-colors border-b border-muted/50 last:border-b-0"
                >
                  <div className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 px-4 py-3 items-center">
                    <div className="md:col-span-3">
                      <p className="font-medium text-ink text-sm">{order.invoiceNumber}</p>
                    </div>
                    <div className="md:col-span-2 text-sm text-body">
                      {formatDateShort(order.dateIn)}
                    </div>
                    <div className="md:col-span-2 text-sm text-body">
                      {formatDateShort(order.dateEstimated)}
                    </div>
                    <div className="md:col-span-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="md:col-span-1">
                      <Badge variant={payment.variant} dot>{payment.label}</Badge>
                    </div>
                    <div className="md:col-span-2 text-right font-semibold text-ink">
                      {formatCurrency(order.totalAmount)}
                    </div>
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
  );
}
