import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        req.cookies.set({
          name,
          value,
          ...options,
        });
        res = NextResponse.next({
          request: {
            headers: req.headers,
          },
        });
        res.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: CookieOptions) {
        req.cookies.set({
          name,
          value: '',
          ...options,
        });
        res = NextResponse.next({
          request: {
            headers: req.headers,
          },
        });
        res.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Redirect logged in users from auth pages
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register' || req.nextUrl.pathname === '/start')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/start'],
};
