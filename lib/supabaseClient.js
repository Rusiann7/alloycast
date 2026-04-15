// para sa pang connect sa supabase client side
// saka na ung sa server side
import { createClient } from "@supabase/supabase-js";

// galing to sa .env.local erp
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// kapag may mali sa supabaseUrl o supabaseAnonKey
if (!supabaseUrl || !supabaseAnonKey) {
  alert("Ayaw gumana env.local ERP");
} else {
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log(
    "Supabase Key starts with:",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10),
  );
}

// para maimport sa ibang files
export const reusableSupabase = createClient(supabaseUrl, supabaseAnonKey);
