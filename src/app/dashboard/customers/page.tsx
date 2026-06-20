import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers } from '@/db/schema';
import { createDb } from '@/lib/db';
import { Users } from 'lucide-react';
import { CustomersList } from '@/features/customers/components/CustomersList';

export default async function CustomersPage() {
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';

  let customersList: any[] = [];

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env);

    customersList = await db
      .select()
      .from(customers)
      .where(eq(customers.tenantId, tenantId));
  } catch (e) {
    console.error('Error:', e);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Pelanggan</h1>
        <p className="text-body mt-1">{customersList.length} pelanggan terdaftar</p>
      </div>

      <CustomersList customers={customersList} />
    </div>
  );
}
