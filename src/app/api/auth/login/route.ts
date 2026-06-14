import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { eq } from 'drizzle-orm';
import { createDb } from '@/db';
import { users } from '@/db/schema';
import { verifyPassword, createSession, SESSION_COOKIE } from '@/lib/auth';

const DUMMY_HASH = '00:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
const GENERIC_ERROR = 'Invalid credentials';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = body.email ?? '';
    const password = body.password ?? '';

    const env = getCloudflareContext().env;
    const db = createDb(env);

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    const hashToCheck = user?.passwordHash || DUMMY_HASH;
    const valid = await verifyPassword(password, hashToCheck);

    if (!user || !valid) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
    }

    const token = await createSession({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      role: user.role as 'OWNER' | 'CASHIER',
    });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
