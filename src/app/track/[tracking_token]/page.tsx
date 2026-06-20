import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, customers, orderItems, services, tenants, orderStatusHistory, orderPhotos } from '@/db/schema';
import { createDb } from '@/lib/db';
import { TrackingView } from '@/components/tracking/tracking-view';

export default async function TrackingPage({ params }: { params: Promise<{ tracking_token: string }> }) {
  const { tracking_token } = await params;

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env);

    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.trackingToken, tracking_token))
      .limit(1);

    if (!orderResult.length) return notFound();
    const order = orderResult[0];

    const customerResult = await db
      .select()
      .from(customers)
      .where(eq(customers.id, order.customerId))
      .limit(1);

    if (!customerResult.length) return notFound();
    const customer = customerResult[0];

    const tenantResult = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, order.tenantId))
      .limit(1);
    const tenantData = tenantResult[0];

    const itemsResult = await db
      .select()
      .from(orderItems)
      .leftJoin(services, eq(orderItems.serviceId, services.id))
      .where(eq(orderItems.orderId, order.id));

    const items = itemsResult.map((item) => ({
      id: item.order_items.id,
      qty: item.order_items.qty,
      subtotal: item.order_items.subtotal,
      serviceName: item.services?.serviceName || 'Layanan',
      serviceType: item.services?.type || 'SATUAN',
      pricePerUnit: item.services?.pricePerUnit || 0,
    }));

    const historyResult = await db
      .select()
      .from(orderStatusHistory)
      .where(eq(orderStatusHistory.orderId, order.id))
      .orderBy(orderStatusHistory.createdAt);

    const statusHistory = historyResult.map((h) => ({
      status: h.status,
      note: h.note,
      updatedBy: h.updatedBy,
      createdAt: h.createdAt,
    }));

    const photosResult = await db
      .select()
      .from(orderPhotos)
      .where(eq(orderPhotos.orderId, order.id))
      .orderBy(orderPhotos.sortOrder);

    const photos = photosResult.map((p) => ({
      id: p.id,
      url: p.url,
      caption: p.caption,
      sortOrder: p.sortOrder,
    }));

    return (
      <TrackingView
        order={{
          id: order.id,
          invoiceNumber: order.invoiceNumber,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
          trackingToken: order.trackingToken,
          dateIn: order.dateIn,
          dateEstimated: order.dateEstimated,
          notes: order.notes,
        }}
        customer={{
          name: customer.name,
          phone: customer.phoneNumber,
        }}
        items={items}
        tenant={tenantData ? {
          name: tenantData.businessName,
          phone: tenantData.phone,
          address: tenantData.address,
          termsAndConditions: tenantData.termsAndConditions,
        } : undefined}
        statusHistory={statusHistory}
        photos={photos}
      />
    );
  } catch (e) {
    console.error('Tracking page error:', e);
    return notFound();
  }
}
