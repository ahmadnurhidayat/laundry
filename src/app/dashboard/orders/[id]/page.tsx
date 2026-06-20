import Link from 'next/link';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services, tenants, orderPhotos } from '@/db/schema';
import { createDb } from '@/lib/db';
import { ArrowLeft, Calendar, Clock, User, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusToggle } from '@/features/orders/components/StatusToggle';
import { ReceiptPreview } from '@/features/orders/components/ReceiptPreview';
import { ShareReceipt } from '@/features/orders/components/ShareReceipt';
import { PhotoUpload } from '@/features/orders/components/PhotoUpload';

const statusConfig = {
  PENDING: { label: 'Menunggu', variant: 'warning' as const, color: 'text-amber-700 bg-amber-50' },
  PROCESSING: { label: 'Diproses', variant: 'info' as const, color: 'text-blue-700 bg-blue-50' },
  FINISHED: { label: 'Selesai', variant: 'success' as const, color: 'text-emerald-700 bg-emerald-50' },
  PICKED_UP: { label: 'Diambil', variant: 'neutral' as const, color: 'text-purple-700 bg-purple-50' },
};

const paymentConfig = {
  UNPAID: { label: 'Belum Bayar', variant: 'danger' as const },
  PAID: { label: 'Lunas', variant: 'success' as const },
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
        className="inline-flex items-center text-sm text-body-mid hover:text-ink transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
        Kembali ke Pesanan
      </Link>

      {/* Hero Header */}
      <div className="bg-canvas rounded-xl border border-muted p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-ink">{order.invoiceNumber}</h1>
              <Badge variant={status.variant}>{status.label}</Badge>
              <Badge variant={payment.variant} dot>{payment.label}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-body">
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
        <div className="bg-canvas-soft rounded-lg p-4 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-body-mid" />
            <h3 className="text-sm font-medium text-ink">Detail Pesanan</h3>
          </div>
          <div className="space-y-2">
            {items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-body">
                  {item.serviceName} x{item.qty}
                </span>
                <span className="font-medium text-ink">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-3 mt-3 border-t border-muted">
              <span className="text-ink">Total</span>
              <span className="text-primary text-lg">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-xs font-medium text-amber-700 mb-1">Catatan</p>
            <p className="text-sm text-amber-800">{order.notes}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Status Controls */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-canvas rounded-xl border border-muted p-6">
            <h2 className="font-semibold text-ink mb-4">Status Pesanan</h2>
            <StatusToggle orderId={order.id} currentStatus={order.orderStatus} type="order" />
          </div>

          {/* Payment Status */}
          <div className="bg-canvas rounded-xl border border-muted p-6">
            <h2 className="font-semibold text-ink mb-4">Status Pembayaran</h2>
            <StatusToggle orderId={order.id} currentStatus={order.paymentStatus} type="payment" />
          </div>

          {/* Photos */}
          <div className="bg-canvas rounded-xl border border-muted p-6">
            <PhotoUpload orderId={order.id} initialPhotos={photos} />
          </div>
        </div>

        {/* Right Column - Receipt Preview */}
        <div>
          <h2 className="text-lg font-semibold text-ink mb-4">Preview Struk</h2>
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
