import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { tenants } from '@/db/schema';
import { createDb } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant-context';

function sanitize(input: unknown, maxLength: number = 2000): string {
  if (typeof input !== 'string') return '';
  let s = '';
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c !== '<' && c !== '>') s += c;
  }
  return s.trim().substring(0, maxLength);
}

export async function GET() {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);

    const result = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, ctx.tenantId))
      .limit(1);

    if (!result.length) {
      return NextResponse.json({ error: 'Tenant tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ tenant: result[0] });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Gagal memuat pengaturan' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as Record<string, unknown>;

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    const updates: Record<string, string | null> = {};

    if (body.businessName !== undefined) {
      updates.businessName = sanitize(body.businessName, 100) || null;
    }
    if (body.phone !== undefined) {
      updates.phone = sanitize(body.phone, 15) || null;
    }
    if (body.address !== undefined) {
      updates.address = sanitize(body.address, 500) || null;
    }
    if (body.termsAndConditions !== undefined) {
      updates.termsAndConditions = sanitize(body.termsAndConditions, 2000) || null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Tidak ada data yang diperbarui' }, { status: 400 });
    }

    await db
      .update(tenants)
      .set(updates)
      .where(eq(tenants.id, ctx.tenantId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Gagal memperbarui pengaturan' }, { status: 500 });
  }
}
