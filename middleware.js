import { createServerClient } from "@supabase/ssr"; // para makawrite ng cookies gamit supabase ssr
import { NextResponse } from "next/server"; // response na ibabato ni Next.js

export async function middleware(request) {
  //automatic na magrun kada page load
  let supabaseResponse = NextResponse.next({ request }); // // default response na pwede makapasok sa pages

  //   pang read at write ng cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser(); //chinecheck kung may user na nakalogin

  //   kung may user na nagskip ng link para makapunta sa productDetail, redirect sa login page
  if (request.nextUrl.pathname.startsWith("/customer/productDetail")) {
    if (!user) {
      return NextResponse.redirect(
        new URL("/customer/auth/login", request.url), // request.url = base domain (e.g. http://localhost:3000)
      );
    }
  }

  // kung may user na nagskip ng link para makapunta sa admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user || user.user_metadata.is_admin !== true) {
      return NextResponse.redirect(new URL("/admin/auth/login", request.url));
    }
  }

  // pwede makapasok kung ok lahat
  return supabaseResponse;
}

// mga url na protektado
export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/productDetail", // matches /customer/productDetail itself
    "/customer/productDetail/:path*", // matches /customer/productDetail/anything
    "/customer/reservation",
    "/customer/reservation/:path*",
  ],
};
