import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  // default response ni next.js para magcontinue sa pagredirect ng url kay admin
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    // from .env.local
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // checks login
        setAll(cookiesToSet) {
          // auto refresh token to prevent auto logout while browser refresh
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value, options),
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  //   checks user session from supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  //   mga links na hindi pwede maacess unless nakalogin at may session
  if (
    request.nextUrl.pathname.startsWith("/admin") && // lahat ng nasa admin protektado
    !request.nextUrl.pathname.startsWith("/admin/auth") &&
    !user
  ) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url));
  }

  //   kung ok lahat, pwede maredirect c admin
  return response;
}

// para magrun lng c middleware.js sa mga admin pages
export const config = {
  matcher: ["/admin/:path*"],
};
