import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, orders } from '@/db/schema';
import { createDb } from '@/lib/db';
import { Users } from 'lucide-react';
import { CustomersList } from '@/features/customers/components/CustomersList';

export default async function CustomersPage() {
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';

  let customersWithStats: any[] = [];

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env);

    const tenantCustomers = await db
      .select()
      .from(customers)
      .where(eq(customers.tenantId, tenantId));

    const tenantOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.tenantId, tenantId));

    customersWithStats = tenantCustomers.map((customer: any) => {
      const customerOrders = tenantOrders.filter((o) => o.customerId === customer.id);
      const totalOrders = customerOrders.length;
      const totalSpent = customerOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
      const lastOrder = customerOrders.sort((a: any, b: any) => new Date(b.dateIn).getTime() - new Date(a.dateIn).getTime())[0];
      return {
        ...customer,
        totalOrders,
        totalSpent,
        lastOrderDate: lastOrder?.dateIn || null,
      };
    });
  } catch (e) {
    console.error('Error:', e);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Pelanggan</h1>
        <p className="text-ink-muted mt-1">{customersWithStats.length} pelanggan terdaftar</p>
      </div>

      <CustomersList customers={customersWithStats} />
    </div>
  );
}
