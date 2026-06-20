import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { orders, orderPhotos } from '@/db/schema';
import { createDb } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant-context';

function generateId(): string {
  return crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const { env } = getCloudflareContext();
    const db = createDb(env);

    const formData = await request.formData();
    const orderId = formData.get('orderId') as string;
    const file = formData.get('file') as File;
    const caption = formData.get('caption') as string || null;

    if (!orderId || !file) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Verify order belongs to tenant
    const orderResult = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.tenantId, ctx.tenantId)))
      .limit(1);

    if (!orderResult.length) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format file tidak didukung' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file terlalu besar (maks 10MB)' }, { status: 400 });
    }

    // Upload to R2
    const ext = file.name.split('.').pop() || 'jpg';
    const key = `orders/${ctx.tenantId}/${orderId}/${generateId()}.${ext}`;

    await env.R2.put(key, file, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Construct public URL
    const photoUrl = `https://laundry.beyondyou.my.id/api/photos/${key}`;

    // Get current photo count for sort order
    const existingPhotos = await db
      .select()
      .from(orderPhotos)
      .where(eq(orderPhotos.orderId, orderId));

    const photoId = generateId();
    await db.insert(orderPhotos).values({
      id: photoId,
      orderId,
      url: photoUrl,
      caption,
      sortOrder: existingPhotos.length,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      photo: { id: photoId, url: photoUrl, caption, sortOrder: existingPhotos.length },
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: 'Gagal mengunggah foto' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const db = createDb(env);

    const photos = await db
      .select()
      .from(orderPhotos)
      .where(eq(orderPhotos.orderId, orderId))
      .orderBy(orderPhotos.sortOrder);

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Gagal memuat foto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const ctx = await getTenantContext();
    const { env } = getCloudflareContext();
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('id');
    const orderId = searchParams.get('orderId');

    if (!photoId || !orderId) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const db = createDb(env);

    // Verify order belongs to tenant
    const orderResult = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.tenantId, ctx.tenantId)))
      .limit(1);

    if (!orderResult.length) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    // Get photo to find R2 key
    const photoResult = await db
      .select()
      .from(orderPhotos)
      .where(eq(orderPhotos.id, photoId))
      .limit(1);

    if (photoResult.length) {
      // Extract R2 key from URL and delete from R2
      const photoUrl = photoResult[0].url;
      const r2Key = photoUrl.replace('https://laundry.beyondyou.my.id/api/photos/', '');
      await env.R2.delete(r2Key);
    }

    await db
      .delete(orderPhotos)
      .where(eq(orderPhotos.id, photoId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Gagal menghapus foto' }, { status: 500 });
  }
}
