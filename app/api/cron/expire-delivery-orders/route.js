import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use the service-role key so we can bypass RLS for bulk updates
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * GET /api/cron/expire-delivery-orders
 *
 * Finds all Door-to-Door + Online Delivery reservations whose
 * payment_status is still "Pending Payment" and were created
 * more than 48 hours ago, then marks them as "Failed".
 *
 * No stock is decremented and no revenue is recorded.
 *
 * Secure this endpoint with a secret header so only your cron
 * service (e.g. Vercel Cron, GitHub Actions, or an external scheduler)
 * can call it.  Set CRON_SECRET in your environment variables.
 */
export async function GET(request) {
  // Optional: protect the route with a shared secret
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // Find Door-to-Door + Online orders still pending payment after 48hrs
    const { data: expired, error: fetchErr } = await supabase
      .from("Reservation")
      .select("id, created_at, user_id, inventory_id")
      .eq("order_type", "Delivery")
      .eq("payment_mode", "Online")
      .eq("payment_status", "Pending Payment")
      .lt("created_at", cutoff);

    if (fetchErr) throw fetchErr;

    if (!expired || expired.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No expired delivery orders found.",
        expired: 0,
      });
    }

    const expiredIds = expired.map((r) => r.id);

    // Mark them as Failed — no stock change, no revenue entry
    const { error: updateErr } = await supabase
      .from("Reservation")
      .update({
        payment_status: "Failed",
        status: "Cancelled",
      })
      .in("id", expiredIds);

    if (updateErr) throw updateErr;

    console.log(
      `[expire-delivery-orders] Marked ${expiredIds.length} reservation(s) as Failed:`,
      expiredIds,
    );

    return NextResponse.json({
      success: true,
      message: `${expiredIds.length} expired delivery order(s) marked as Failed.`,
      expired: expiredIds.length,
      ids: expiredIds,
    });
  } catch (err) {
    console.error("[expire-delivery-orders] Error:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
