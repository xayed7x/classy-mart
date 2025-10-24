import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // This call is essential to refresh the session cookie
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Define protected admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  // If the user is not logged in and is trying to access a protected admin route (but not the login page itself)
  if (!session && isAdminRoute && pathname !== '/admin/login') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    return NextResponse.redirect(redirectUrl);
  }
  
  // If the user IS logged in and is trying to access an admin route
  if (session && isAdminRoute) {
    // Fetch the user's role from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    // If there's an error or the profile doesn't exist, deny access
    if (error || !profile) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/'; // Redirect to homepage on error
      return NextResponse.redirect(redirectUrl);
    }

    // If the user's role is not 'admin', deny access
    if (profile.role !== 'admin') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/'; // Redirect non-admins to homepage
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If all checks pass, allow the request to continue
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
