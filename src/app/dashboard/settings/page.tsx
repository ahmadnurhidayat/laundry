import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { tenants } from '@/db/schema';
import { createDb } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2, Phone } from 'lucide-react';

export default async function SettingsPage() {
  const h = await headers();
  const tenantId = h.get('x-tenant-id') || '';

  let tenant: any = null;

  try {
    const { env } = getCloudflareContext();
    const db = createDb(env);

    const result = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .limit(1);

    tenant = result[0];
  } catch (e) {
    console.error('Error:', e);
  }

  if (!tenant) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-ink">Pengaturan</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-body-mid">Gagal memuat data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Pengaturan</h1>
        <p className="text-body-mid text-sm mt-1">Informasi bisnis Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-ink">Informasi Bisnis</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-body-mid uppercase tracking-wider">Nama Bisnis</label>
              <p className="text-ink font-medium mt-1">{tenant.businessName}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-body-mid uppercase tracking-wider">Slug</label>
              <p className="text-ink font-medium mt-1">{tenant.slug}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-body-mid uppercase tracking-wider">Status</label>
              <p className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tenant.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tenant.status === 'ACTIVE' ? 'Aktif' : 'Suspensi'}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-ink">Kontak</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-body-mid uppercase tracking-wider">Telepon</label>
              <p className="text-ink font-medium mt-1">{tenant.phone || '-'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-body-mid uppercase tracking-wider">Alamat</label>
              <p className="text-ink font-medium mt-1">{tenant.address || '-'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
