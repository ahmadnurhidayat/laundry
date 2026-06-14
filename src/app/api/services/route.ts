import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { services } from '@/db/schema';
import { createDb } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant-context';

export async function GET() {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);

    const tenantServices = await db
      .select()
      .from(services)
      .where(eq(services.tenantId, ctx.tenantId));

    return NextResponse.json({ services: tenantServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
