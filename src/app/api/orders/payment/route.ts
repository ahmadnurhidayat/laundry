import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders } from '@/db/schema';
import { createDb } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant-context';

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as Record<string, unknown>;

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const orderId = typeof body.orderId === 'string' ? body.orderId : '';
    const status = typeof body.status === 'string' ? body.status : '';

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const validStatuses = ['UNPAID', 'PAID'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
    }

    await db
      .update(orders)
      .set({ paymentStatus: status as 'UNPAID' | 'PAID' })
      .where(and(eq(orders.id, orderId), eq(orders.tenantId, ctx.tenantId)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Gagal memperbarui pembayaran' }, { status: 500 });
  }
}
