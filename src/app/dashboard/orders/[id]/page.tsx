import Link from 'next/link';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services, tenants, orderPhotos } from '@/db/schema';
import { createDb } from '@/lib/db';
import { ArrowLeft, Calendar, Clock, User, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusToggle } from '@/features/orders/components/StatusToggle';
import { ReceiptPreview } from '@/features/orders/components/ReceiptPreview';
import { ShareReceipt } from '@/features/orders/components/ShareReceipt';
import { PhotoUpload } from '@/features/orders/components/PhotoUpload';

const statusConfig = {
  PENDING: { label: 'Pending', badgeClass: 'bg-zinc-100 text-zinc-800 border border-zinc-200' },
  PROCESSING: { label: 'Processing', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
  FINISHED: { label: 'Selesai', badgeClass: 'bg-green-50 text-green-700 border border-green-200' },
  PICKED_UP: { label: 'Diambil', badgeClass: 'bg-zinc-100 text-zinc-600 border border-zinc-200' },
};

const paymentConfig = {
  UNPAID: { label: 'Belum Bayar', badgeClass: 'bg-red-50 text-red-700 border border-red-200' },
  PAID: { label: 'Lunas', badgeClass: 'bg-green-50 text-green-700 border border-green-200' },
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';

  let order: any = null;
  let customer: any = null;
  let items: any[] = [];
  let tenant: any = null;
  let photos: any[] = [];

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

    const tenantResult = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
    tenant = tenantResult[0];

    const photosResult = await db
      .select()
      .from(orderPhotos)
      .where(eq(orderPhotos.orderId, id))
      .orderBy(orderPhotos.sortOrder);

    photos = photosResult.map((p) => ({
      id: p.id,
      url: p.url,
      caption: p.caption,
      sortOrder: p.sortOrder,
    }));
  } catch (e) {
    console.error('Error:', e);
    return notFound();
  }

  if (!order) return notFound();

  const status = statusConfig[order.orderStatus as keyof typeof statusConfig];
  const payment = paymentConfig[order.paymentStatus as keyof typeof paymentConfig];

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center text-sm text-ink-muted hover:text-ink transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Kembali
      </Link>

      {/* Hero Header */}
      <div className="bg-canvas-elevated rounded-xl border border-border-subtle shadow-premium-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-semibold text-ink font-mono">{order.invoiceNumber}</h1>
              <span className={`inline-flex items-center font-mono text-xs px-2.5 py-0.5 rounded-full ${status.badgeClass}`}>
                {status.label}
              </span>
              <span className={`inline-flex items-center font-mono text-xs px-2.5 py-0.5 rounded-full ${payment.badgeClass}`}>
                {payment.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {customer?.name || 'Pelanggan'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(order.dateIn)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Est: {formatDate(order.dateEstimated)}
              </span>
            </div>
          </div>
          <ShareReceipt
            order={order}
            customer={customer}
            items={items.map((item: any) => ({
              serviceName: item.serviceName || '',
              qty: item.qty,
              subtotal: item.subtotal,
            }))}
            tenantName={tenant?.businessName || 'Laundry'}
          />
        </div>

        {/* Order Items Summary */}
        <div className="bg-canvas rounded-lg p-4 mt-4 border border-border-subtle">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-ink-muted" />
            <h3 className="text-sm font-medium text-ink">Detail Pesanan</h3>
          </div>
          <div className="space-y-2">
            {items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-ink-muted">
                  {item.serviceName} ×{item.qty}
                </span>
                <span className="font-mono font-medium text-ink">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold pt-3 mt-3 border-t border-border-subtle">
              <span className="text-ink">Total</span>
              <span className="font-mono text-brand text-lg">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
            <p className="text-xs font-medium text-zinc-600 mb-1">Catatan</p>
            <p className="text-sm text-zinc-800">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Status Controls */}
        <div className="space-y-6">
          <div className="bg-canvas-elevated rounded-xl border border-border-subtle shadow-premium-sm p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Status Pesanan</h2>
            <StatusToggle orderId={order.id} currentStatus={order.orderStatus} type="order" />
          </div>

          <div className="bg-canvas-elevated rounded-xl border border-border-subtle shadow-premium-sm p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Status Pembayaran</h2>
            <StatusToggle orderId={order.id} currentStatus={order.paymentStatus} type="payment" />
          </div>

          <div className="bg-canvas-elevated rounded-xl border border-border-subtle shadow-premium-sm p-5">
            <PhotoUpload orderId={order.id} initialPhotos={photos} />
          </div>
        </div>

        {/* Right Column - Receipt Preview */}
        <div>
          <h2 className="text-sm font-semibold text-ink mb-4">Preview Struk</h2>
          <ReceiptPreview
            order={order}
            customer={customer}
            items={items.map((item: any) => ({
              serviceName: item.serviceName || '',
              qty: item.qty,
              subtotal: item.subtotal,
            }))}
            tenant={tenant ? { name: tenant.businessName, phone: tenant.phone, address: tenant.address } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
