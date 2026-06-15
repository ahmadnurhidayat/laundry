import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { eq } from 'drizzle-orm';
import { createDb } from '@/lib/db';
import { users } from '@/db/schema';
import { verifyPassword, createSession, SESSION_COOKIE } from '@/lib/auth';

const DUMMY_HASH = '00:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
const GENERIC_ERROR = 'Nomor telepon atau password salah';

function validatePhone(phone: string): boolean {
  return typeof phone === 'string' && /^[0-9]{10,15}$/.test(phone);
}

function validatePassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 8 && password.length <= 128;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { phone?: string; password?: string };

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    const phone = typeof body.phone === 'string' ? body.phone : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!validatePhone(phone) || !validatePassword(password)) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
    }

    const env = getCloudflareContext().env;
    const db = createDb(env);

    const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);

    const hashToCheck = user?.passwordHash || DUMMY_HASH;
    const valid = await verifyPassword(password, hashToCheck);

    if (!user || !valid) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    const token = await createSession({
      userId: user.id,
      tenantId: user.tenantId,
      phone: user.phone,
      name: user.name,
      role: user.role as 'OWNER' | 'CASHIER',
    }, env.JWT_SECRET);

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
    });

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
