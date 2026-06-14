import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services } from '@/db/schema';
import { createDb } from '@/db/index';
import { StatusToggle } from '@/components/orders/status-toggle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { BASE_URL } from '@/lib/constants';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order: any = null;
  let customer: any = null;
  let items: any[] = [];

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);

    const orderResult = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
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

  const trackingUrl = `${BASE_URL}/track/${order.trackingToken}`;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.invoiceNumber}</h1>
          <p className="text-gray-600">{customer?.name} - {customer?.phoneNumber}</p>
        </div>
        <Link href={`/orders/${order.id}/invoice`}>
          <Button variant="secondary">
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="font-semibold">Order Status</h2>
        </CardHeader>
        <CardContent>
          <StatusToggle orderId={order.id} currentStatus={order.orderStatus} type="order" />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="font-semibold">Payment Status</h2>
        </CardHeader>
        <CardContent>
          <StatusToggle orderId={order.id} currentStatus={order.paymentStatus} type="payment" />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="font-semibold">Order Details</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Date In</span>
              <span>{formatDate(order.dateIn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated</span>
              <span>{formatDate(order.dateEstimated)}</span>
            </div>
            {order.notes && (
              <div className="flex justify-between">
                <span className="text-gray-600">Notes</span>
                <span>{order.notes}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <h2 className="font-semibold">Items</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.serviceName} x{item.qty}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold pt-2 mt-2 border-t">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Tracking Link</h2>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 break-all">{trackingUrl}</p>
        </CardContent>
      </Card>
    </div>
  );
}
