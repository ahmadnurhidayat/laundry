import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

const PUBLIC_PATHS = ['/', '/login', '/register', '/track', '/api/auth', '/api/track', '/_next', '/icons', '/manifest.json', '/favicon.ico'];

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxAttempts: number = 10, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (entry && now < entry.resetTime) {
    if (entry.count >= maxAttempts) return false;
    entry.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  }

  if (rateLimitMap.size > 10000) {
    const cutoff = now - windowMs;
    for (const [key, val] of rateLimitMap) {
      if (val.resetTime < cutoff) rateLimitMap.delete(key);
    }
  }

  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/api/auth/login' || pathname === '/api/auth/register') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('cf-connecting-ip')
      || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak percobaan. Coba lagi nanti.' }, { status: 429 });
    }
  }

  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/_next/') || pathname.startsWith('/icons/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  let session;
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = getCloudflareContext();
    session = await verifySession(sessionToken, env.JWT_SECRET);
  } catch {
    session = null;
  }

  if (!session) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', session.tenantId);
    response.headers.set('x-user-id', session.userId);
    response.headers.set('x-user-role', session.role);
    response.headers.set('x-user-name', session.name);
    response.headers.set('x-user-phone', session.phone);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
