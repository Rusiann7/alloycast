import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    // Exchange code for user session
    const {
      data: { user },
      error: exchangeError,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      return NextResponse.redirect(
        `${origin}/admin/auth/login?error=${encodeURIComponent(exchangeError.message)}`,
      );
    }

    // // Security Check: Be flexible (handle both boolean true and string "true")
    // const isAdmin = user?.user_metadata?.is_admin;
    // if (isAdmin !== true && isAdmin !== "true") {
    //   await supabase.auth.signOut();
    //   return NextResponse.redirect(
    //     `${origin}/admin/auth/login?error=not_an_admin`,
    //   );
    // }
  }

  // Success! Go straight to the inventory
  return NextResponse.redirect(`${origin}/admin/inventory`);
}
