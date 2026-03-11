import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in middleware');
    return res;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } catch (error) {
    console.error('Middleware execution failed:', error);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/start'],
};
