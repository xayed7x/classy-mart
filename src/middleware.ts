import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge-Safe Middleware
 * 
 * This middleware performs ONLY basic cookie-based session checks.
 * It does NOT import @supabase/ssr to remain compatible with Edge Runtime.
 * 
 * Detailed authorization (role checks, etc.) is handled in the actual
 * server components and API routes ("Defense in Depth").
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check for Supabase session cookie
  // The cookie name pattern is typically: sb-<project-ref>-auth-token
  // We'll check for any cookie starting with 'sb-' and containing 'auth-token'
  const hasSessionCookie = Array.from(request.cookies.getAll()).some(
    cookie => cookie.name.includes('sb-') && cookie.name.includes('auth-token')
  );

  // Protect admin routes (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !hasSessionCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Protect customer account routes
  if (pathname.startsWith('/account') && !hasSessionCookie) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
