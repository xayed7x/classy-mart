// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware-client';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  // Rule #1: If the user is trying to access the admin area...
  if (pathname.startsWith('/admin')) {
    
    // Rule #2: ...but they are just trying to get to the login page, always let them.
    if (pathname === '/admin/login') {
      return response;
    }

    // Rule #3: If they are NOT on the login page and there is NO session...
    if (!session) {
      // ...redirect them to the login page.
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Rule #4: If there IS a session, check their role.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Rule #5: If their role is NOT 'admin'...
    if (profile?.role !== 'admin') {
      // ...kick them out to the homepage.
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (pathname.startsWith('/account')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If none of the admin rules match, just continue as normal.
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
