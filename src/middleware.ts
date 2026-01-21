/**
 * MIDDLEWARE
 * ==========
 * 
 * Edge-compatible middleware for route protection.
 * 
 * DEMO_MODE = true হলে → demo-admin-auth cookie চেক হয়
 * DEMO_MODE = false হলে → Supabase session cookie চেক হয়
 * 
 * Note: Detailed authorization (role checks) handled in server components.
 */

import { NextResponse, type NextRequest } from 'next/server';

// Check if we're in demo mode by environment or default to true
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // 🎯 DEMO MODE: Check for demo auth cookie
    if (DEMO_MODE) {
      const hasDemoAuth = request.cookies.get('demo-admin-auth')?.value === 'true';
      
      // Protect admin routes (except login page)
      if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !hasDemoAuth) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      // In demo mode, allow access to account routes (no user system)
      // Just pass through
      
      return NextResponse.next();
    }

    // [INTEGRATION POINT] Dynamic Mode: Check Supabase session
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
  } catch (e) {
    console.error("Error in middleware:", e);
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    
    // Attempt to clear potentially bad cookies
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    response.cookies.delete('demo-admin-auth');
    
    // Clear any auth-token cookies
    const authCookies = Array.from(request.cookies.getAll()).filter(
      cookie => cookie.name.includes('sb-') && cookie.name.includes('auth-token')
    );
    authCookies.forEach(cookie => {
      response.cookies.delete(cookie.name);
    });
    
    // For admin routes, always redirect to login on error
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
