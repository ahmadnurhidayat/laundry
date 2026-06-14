import { NextRequest, NextResponse } from 'next/server';
import { like, or, eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers } from '@/db/schema';
import { createDb } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant-context';

export async function GET(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ customers: [] });
    }

    const results = await db
      .select()
      .from(customers)
      .where(
        eq(customers.tenantId, ctx.tenantId) &&
        or(
          like(customers.name, `%${query}%`),
          like(customers.phoneNumber, `%${query}%`)
        )
      )
      .limit(10);

    return NextResponse.json({ customers: results });
  } catch (error) {
    console.error('Error searching customers:', error);
    return NextResponse.json({ error: 'Failed to search customers' }, { status: 500 });
  }
}
