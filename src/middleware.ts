import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { verifySession, SESSION_COOKIE } from '@/lib/auth';

const PUBLIC_PATHS = ['/', '/login', '/register', '/track', '/api/auth', '/api/track', '/_next', '/icons', '/manifest.json', '/favicon.ico'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  const { env } = getCloudflareContext();
  const session = await verifySession(sessionToken, env.JWT_SECRET);

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
