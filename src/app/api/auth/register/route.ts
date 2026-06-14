import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { eq } from 'drizzle-orm';
import { createDb } from '@/db';
import { tenants, users, services } from '@/db/schema';
import { hashPassword, createSession, SESSION_COOKIE } from '@/lib/auth';
import { DEFAULT_SERVICES } from '@/lib/defaults';

function generateId(): string {
  return crypto.randomUUID();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      businessName: string;
      email: string;
      password: string;
      name: string;
      phone?: string;
      address?: string;
    };
    const { businessName, email, password, name, phone, address } = body;

    if (!businessName || !email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const env = getCloudflareContext().env;
    const db = createDb(env);

    // Check if email already exists
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Create tenant
    const tenantId = generateId();
    let slug = slugify(businessName);

    // Ensure unique slug
    const [existingSlug] = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    await db.insert(tenants).values({
      id: tenantId,
      businessName,
      slug,
      address: address || null,
      phone: phone || null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    });

    // Create owner user
    const userId = generateId();
    const passwordHash = await hashPassword(password);

    await db.insert(users).values({
      id: userId,
      tenantId,
      email,
      passwordHash,
      name,
      role: 'OWNER',
    });

    // Seed default services
    for (const svc of DEFAULT_SERVICES) {
      await db.insert(services).values({
        id: generateId(),
        tenantId,
        ...svc,
      });
    }

    // Create session
    const token = await createSession({
      userId,
      tenantId,
      email,
      name,
      role: 'OWNER',
    });

    const response = NextResponse.json({
      user: { id: userId, name, email, role: 'OWNER' },
      tenant: { id: tenantId, businessName, slug },
    }, { status: 201 });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
