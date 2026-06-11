import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  const { email, password } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("Users")
    .select("id")
    .eq("email", email)
    .single();

  if (error) return Response.json({ error: "User not found" }, { status: 404 });

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    data.id,
    { password },
  );

  if (authError)
    return Response.json({ error: authError.message }, { status: 500 });

  return Response.json({ success: true });
}
