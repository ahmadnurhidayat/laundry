import { NextResponse } from 'next/server';
import { like, or } from 'drizzle-orm';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { customers } from '@/db/schema';
import { createDb } from '@/db/index';

export async function GET(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ customers: [] });
    }

    const results = await db
      .select()
      .from(customers)
      .where(
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
