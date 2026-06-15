import { headers } from 'next/headers';
import { eq, desc } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, orders } from '@/db/schema';
import { createDb } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users, Phone, ShoppingBag } from 'lucide-react';

export default async function CustomersPage() {
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';

  let customersList: any[] = [];

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env);

    const result = await db
      .select()
      .from(customers)
      .where(eq(customers.tenantId, tenantId))
      .orderBy(desc(customers.id));

    customersList = result;
  } catch (e) {
    console.error('Error:', e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Pelanggan</h1>
        <p className="text-body-mid text-sm mt-1">{customersList.length} pelanggan terdaftar</p>
      </div>

      {customersList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted mx-auto mb-3" />
            <p className="text-body-mid">Belum ada pelanggan</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customersList.map((customer) => (
            <Card key={customer.id} hover>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">
                      {customer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-ink truncate">{customer.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-body-mid text-sm">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{customer.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
