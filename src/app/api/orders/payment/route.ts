import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders } from '@/db/schema';
import { createDb } from '@/db/index';

export async function PATCH(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);
    const body = await request.json() as { orderId?: string; status?: string };
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing orderId or status' }, { status: 400 });
    }

    await db.update(orders).set({ paymentStatus: status }).where(eq(orders.id, orderId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
