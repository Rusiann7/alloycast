// // itong file na to is para sa paghandle ng Session at cookies kapag mag-sign up o login via Google
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  // api route handler para sa request kay Google sign in/up
  const { searchParams, origin } = new URL(request.url); // extracts Client secret code at ung base url "customer/auth/register"
  const code = searchParams.get("code"); // kinukuha nya ung code na galing kay supabase at google mula sa url

  if (code) {
    // pang check kung ung existed na ung user account
    const cookieStore = await cookies(); // save sa cookie ung user session
    const supabase = createServerClient(
      // galing kay .env.local
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        // read at write ng cookie sa supabase
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
    // session token masasave sa cookie
    const {
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);
  }

  // default flow for customers
  return NextResponse.redirect(`${origin}/customer/productDetail`);
}
