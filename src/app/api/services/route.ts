import { NextRequest, NextResponse } from 'next/server';
import { eq, sql } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { services } from '@/db/schema';
import { createDb } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant-context';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);

    const tenantServices = await db
      .select()
      .from(services)
      .where(eq(services.tenantId, ctx.tenantId))
      .orderBy(services.sortOrder, services.serviceName);

    return NextResponse.json({ services: tenantServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Gagal mengambil data layanan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as Record<string, unknown>;

    const serviceName = typeof body.serviceName === 'string' ? body.serviceName.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const type = body.type === 'KILOAN' || body.type === 'SATUAN' ? body.type : 'KILOAN';
    const pricePerUnit = typeof body.pricePerUnit === 'number' ? body.pricePerUnit : 0;
    const minWeight = typeof body.minWeight === 'number' ? body.minWeight : 0;

    if (!serviceName || pricePerUnit <= 0) {
      return NextResponse.json({ error: 'Nama layanan dan harga wajib diisi' }, { status: 400 });
    }

    // Get max sort order
    const maxOrder = await db
      .select({ max: sql<number>`coalesce(max(${services.sortOrder}), 0)` })
      .from(services)
      .where(eq(services.tenantId, ctx.tenantId));

    const result = await db
      .insert(services)
      .values({
        id: generateId(),
        tenantId: ctx.tenantId,
        serviceName,
        description: description || null,
        type,
        pricePerUnit,
        minWeight,
        isActive: 1,
        sortOrder: (maxOrder[0]?.max || 0) + 1,
      })
      .returning();

    return NextResponse.json({ service: result[0] });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Gagal membuat layanan' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as Record<string, unknown>;

    const id = typeof body.id === 'string' ? body.id : '';
    const serviceName = typeof body.serviceName === 'string' ? body.serviceName.trim() : undefined;
    const description = typeof body.description === 'string' ? body.description.trim() : undefined;
    const type = body.type === 'KILOAN' || body.type === 'SATUAN' ? body.type : undefined;
    const pricePerUnit = typeof body.pricePerUnit === 'number' ? body.pricePerUnit : undefined;
    const minWeight = typeof body.minWeight === 'number' ? body.minWeight : undefined;
    const isActive = typeof body.isActive === 'number' ? body.isActive : undefined;

    if (!id) {
      return NextResponse.json({ error: 'ID layanan wajib diisi' }, { status: 400 });
    }

    // Verify service belongs to this tenant
    const existing = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!existing.length || existing[0].tenantId !== ctx.tenantId) {
      return NextResponse.json({ error: 'Layanan tidak ditemukan' }, { status: 404 });
    }

    await db
      .update(services)
      .set({
        ...(serviceName !== undefined && { serviceName }),
        ...(description !== undefined && { description: description || null }),
        ...(type !== undefined && { type }),
        ...(pricePerUnit !== undefined && { pricePerUnit }),
        ...(minWeight !== undefined && { minWeight }),
        ...(isActive !== undefined && { isActive }),
      })
      .where(eq(services.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Gagal memperbarui layanan' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID layanan wajib diisi' }, { status: 400 });
    }

    // Verify service belongs to this tenant
    const existing = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!existing.length || existing[0].tenantId !== ctx.tenantId) {
      return NextResponse.json({ error: 'Layanan tidak ditemukan' }, { status: 404 });
    }

    await db.delete(services).where(eq(services.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Gagal menghapus layanan' }, { status: 500 });
  }
}
