import Link from 'next/link';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services } from '@/db/schema';
import { createDb } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { StatusToggle } from '@/features/orders/components/StatusToggle';
import { ReceiptPreview } from '@/features/orders/components/ReceiptPreview';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';

  let order: any = null;
  let customer: any = null;
  let items: any[] = [];

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
  } catch (e) {
    console.error('Error:', e);
    return notFound();
  }

  if (!order) return notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Kembali ke Pesanan
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pesanan #{order.invoiceNumber}</h1>
          <p className="text-gray-500 mt-1">{customer?.name} - {customer?.phoneNumber}</p>
        </div>
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
                  <span className="text-gray-500">Tanggal Masuk</span>
                  <span className="text-gray-900">{formatDate(order.dateIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimasi Selesai</span>
                  <span className="text-gray-900">{formatDate(order.dateEstimated)}</span>
                </div>
                {order.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Catatan</span>
                    <span className="text-gray-900">{order.notes}</span>
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
                    <span className="text-gray-600">
                      {item.serviceName} x{item.qty}
                    </span>
                    <span className="font-medium text-gray-900">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-3 mt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Receipt Preview */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview Struk</h2>
          <ReceiptPreview
            order={order}
            customer={customer}
            items={items.map((item: any) => ({
              serviceName: item.serviceName || '',
              qty: item.qty,
              subtotal: item.subtotal,
            }))}
          />
        </div>
      </div>
    </div>
  );
}

