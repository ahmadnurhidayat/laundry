import { NextRequest, NextResponse } from 'next/server';
import { like, or, eq, sql, desc } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers, orders } from '@/db/schema';
import { createDb } from '@/lib/db';
import { getTenantContext } from '@/lib/tenant-context';
import { generateId } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const id = searchParams.get('id');

    // Get single customer by ID with stats
    if (id) {
      const result = await db
        .select({
          id: customers.id,
          name: customers.name,
          phoneNumber: customers.phoneNumber,
          address: customers.address,
          notes: customers.notes,
          createdAt: customers.createdAt,
        })
        .from(customers)
        .where(eq(customers.id, id))
        .limit(1);

      if (!result.length) {
        return NextResponse.json({ error: 'Pelanggan tidak ditemukan' }, { status: 404 });
      }

      // Get order stats
      const stats = await db
        .select({
          totalOrders: sql<number>`count(${orders.id})`,
          totalSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
          lastOrderDate: sql<string>`max(${orders.dateIn})`,
        })
        .from(orders)
        .where(eq(orders.customerId, id));

      // Get recent orders
      const recentOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.customerId, id))
        .orderBy(desc(orders.dateIn))
        .limit(5);

      return NextResponse.json({
        customer: result[0],
        stats: stats[0],
        recentOrders,
      });
    }

    // Search customers
    if (query) {
      const results = await db
        .select()
        .from(customers)
        .where(
          eq(customers.tenantId, ctx.tenantId) &&
          or(
            like(customers.name, `%${query}%`),
            like(customers.phoneNumber, `%${query}%`),
            like(customers.address, `%${query}%`)
          )
        )
        .limit(20);

      return NextResponse.json({ customers: results });
    }

    // List all customers with stats
    const allCustomers = await db
      .select({
        id: customers.id,
        name: customers.name,
        phoneNumber: customers.phoneNumber,
        address: customers.address,
        notes: customers.notes,
        createdAt: customers.createdAt,
      })
      .from(customers)
      .where(eq(customers.tenantId, ctx.tenantId));

    // Get stats for each customer
    const customersWithStats = await Promise.all(
      allCustomers.map(async (c) => {
        const stats = await db
          .select({
            totalOrders: sql<number>`count(${orders.id})`,
            totalSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`,
            lastOrderDate: sql<string>`max(${orders.dateIn})`,
          })
          .from(orders)
          .where(eq(orders.customerId, c.id));
        return { ...c, ...stats[0] };
      })
    );

    // Sort by last order date (most recent first)
    customersWithStats.sort((a, b) => {
      if (!a.lastOrderDate) return 1;
      if (!b.lastOrderDate) return -1;
      return b.lastOrderDate.localeCompare(a.lastOrderDate);
    });

    return NextResponse.json({ customers: customersWithStats });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pelanggan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as Record<string, unknown>;

    const name = typeof body.name === 'string' ? body.name : '';
    const phoneNumber = typeof body.phoneNumber === 'string' ? body.phoneNumber : '';
    const address = typeof body.address === 'string' ? body.address : '';
    const notes = typeof body.notes === 'string' ? body.notes : '';

    if (!name || !phoneNumber) {
      return NextResponse.json({ error: 'Nama dan nomor telepon wajib diisi' }, { status: 400 });
    }

    // Check if customer already exists for this tenant
    const existing = await db
      .select()
      .from(customers)
      .where(eq(customers.tenantId, ctx.tenantId) && eq(customers.phoneNumber, phoneNumber))
      .limit(1);

    if (existing.length) {
      return NextResponse.json({ customer: existing[0] });
    }

    const result = await db
      .insert(customers)
      .values({
        id: generateId(),
        tenantId: ctx.tenantId,
        name,
        phoneNumber,
        address: address || null,
        notes: notes || null,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json({ customer: result[0] });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Gagal membuat pelanggan' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ctx = await getTenantContext();
    const env = getCloudflareContext().env;
    const db = createDb(env);
    const body = await request.json() as Record<string, unknown>;

    const id = typeof body.id === 'string' ? body.id : '';
    const name = typeof body.name === 'string' ? body.name : undefined;
    const phoneNumber = typeof body.phoneNumber === 'string' ? body.phoneNumber : undefined;
    const address = typeof body.address === 'string' ? body.address : undefined;
    const notes = typeof body.notes === 'string' ? body.notes : undefined;

    if (!id) {
      return NextResponse.json({ error: 'ID pelanggan wajib diisi' }, { status: 400 });
    }

    await db
      .update(customers)
      .set({
        ...(name !== undefined && { name }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(address !== undefined && { address: address || null }),
        ...(notes !== undefined && { notes: notes || null }),
      })
      .where(eq(customers.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Gagal memperbarui pelanggan' }, { status: 500 });
  }
}
