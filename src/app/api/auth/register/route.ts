import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { eq } from 'drizzle-orm';
import { createDb } from '@/lib/db';
import { tenants, users, services } from '@/db/schema';
import { hashPassword, createSession, SESSION_COOKIE } from '@/lib/auth';
import { DEFAULT_SERVICES } from '@/lib/defaults';

const GENERIC_ERROR = 'Gagal mendaftar';

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

function validateInput(value: unknown, maxLength: number = 100): string {
  if (typeof value !== 'string') return '';
  return value.trim().substring(0, maxLength);
}

function validatePhone(phone: string): boolean {
  return /^[0-9]{10,15}$/.test(phone);
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (typeof password !== 'string') return { valid: false, error: 'Password wajib diisi' };
  if (password.length < 8) return { valid: false, error: 'Password minimal 8 karakter' };
  if (password.length > 128) return { valid: false, error: 'Password maksimal 128 karakter' };
  if (!/[a-z]/.test(password)) return { valid: false, error: 'Password harus mengandung huruf kecil' };
  if (!/[0-9]/.test(password)) return { valid: false, error: 'Password harus mengandung angka' };
  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    const businessName = validateInput(body.businessName, 100);
    const phone = validateInput(body.phone, 15);
    const name = validateInput(body.name, 100);
    const address = validateInput(body.address, 200);

    if (!businessName || !phone || !name) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Nomor telepon tidak valid' }, { status: 400 });
    }

    const passwordRaw = typeof body.password === 'string' ? body.password : '';
    const passwordCheck = validatePassword(passwordRaw);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.error }, { status: 400 });
    }

    const password = passwordRaw;

    const env = getCloudflareContext().env;
    const db = createDb(env);

    const [existing] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (existing) {
      return NextResponse.json({ error: 'Nomor telepon sudah terdaftar' }, { status: 409 });
    }

    const tenantId = generateId();
    let slug = slugify(businessName);

    const [existingSlug] = await db.select().from(tenants).where(eq(tenants.slug, slug)).limit(1);
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    await db.insert(tenants).values({
      id: tenantId,
      businessName,
      slug,
      address: address || null,
      phone,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    });

    const userId = generateId();
    const passwordHash = await hashPassword(password);

    await db.insert(users).values({
      id: userId,
      tenantId,
      phone,
      passwordHash,
      name,
      role: 'OWNER',
    });

    for (const svc of DEFAULT_SERVICES) {
      await db.insert(services).values({
        id: generateId(),
        tenantId,
        ...svc,
      });
    }

    const token = await createSession({
      userId,
      tenantId,
      phone,
      name,
      role: 'OWNER',
    }, env.JWT_SECRET);

    const response = NextResponse.json({
      user: { id: userId, name, phone, role: 'OWNER' },
      tenant: { id: tenantId, businessName, slug },
    }, { status: 201 });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
  }
}
