import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ------------------------------------------------------------------
  // 1. Supabase session refresh (if Supabase is configured)
  // ------------------------------------------------------------------
  let supabaseResponse = NextResponse.next({ request });

  if (SUPABASE_CONFIGURED) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect admin routes. With localePrefix='as-needed', Persian admin has
    // no prefix (/admin), English has /en/admin.
    const adminMatch = pathname.match(/^\/(?:(en|fa)\/)?admin/);
    if (adminMatch && !user) {
      const locale = adminMatch[1]; // 'en', 'fa', or undefined (= default fa)
      const loginPath = locale === 'en' ? '/en/login' : '/login';
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set('next', pathname);
      const loginRedirect = NextResponse.redirect(loginUrl);
      supabaseResponse.cookies
        .getAll()
        .forEach(({ name, value }) => loginRedirect.cookies.set(name, value));
      return loginRedirect;
    }
  }

  // ------------------------------------------------------------------
  // 2. next-intl locale routing
  // ------------------------------------------------------------------
  const intlResponse = intlMiddleware(request);

  // Copy any Supabase auth cookies onto the intl response so the session
  // is properly refreshed even when next-intl issues a redirect.
  supabaseResponse.cookies
    .getAll()
    .forEach(({ name, value }) => intlResponse.cookies.set(name, value));

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
