import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { tenants } from '@/db/schema';
import { createDb } from '@/lib/db';
import { SettingsForm } from '@/features/settings/components/SettingsForm';

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
        <div className="bg-canvas-soft rounded-md p-12 text-center">
          <p className="text-body-mid">Gagal memuat data</p>
        </div>
      </div>
    );
  }

  return <SettingsForm initialTenant={tenant} />;
}
