import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { services } from '@/db/schema';
import { createDb } from '@/db/index';

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const db = createDb(env as any);
    const allServices = await db.select().from(services);
    return NextResponse.json({ services: allServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
