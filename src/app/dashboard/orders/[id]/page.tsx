import Link from 'next/link';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services, tenants, orderPhotos } from '@/db/schema';
import { createDb } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusToggle } from '@/features/orders/components/StatusToggle';
import { ReceiptPreview } from '@/features/orders/components/ReceiptPreview';
import { ShareReceipt } from '@/features/orders/components/ShareReceipt';
import { PhotoUpload } from '@/features/orders/components/PhotoUpload';

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

    const photos = photosResult.map((p) => ({
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

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center text-sm text-body-mid hover:text-ink transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Kembali ke Pesanan
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Pesanan #{order.invoiceNumber}</h1>
          <p className="text-body-mid mt-1">{customer?.name} - {customer?.phoneNumber}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Status Pesanan</h2>
            </CardHeader>
            <CardContent>
              <StatusToggle orderId={order.id} currentStatus={order.orderStatus} type="order" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold">Status Pembayaran</h2>
            </CardHeader>
            <CardContent>
              <StatusToggle orderId={order.id} currentStatus={order.paymentStatus} type="payment" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold">Detail Pesanan</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-body-mid">Tanggal Masuk</span>
                  <span className="text-ink">{formatDate(order.dateIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-mid">Estimasi Selesai</span>
                  <span className="text-ink">{formatDate(order.dateEstimated)}</span>
                </div>
                {order.notes && (
                  <div className="flex justify-between">
                    <span className="text-body-mid">Catatan</span>
                    <span className="text-ink">{order.notes}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold">Item</h2>
            </CardHeader>
            <CardContent>
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
                  <span className="text-ink">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <PhotoUpload orderId={order.id} initialPhotos={photos} />
            </CardContent>
          </Card>
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
