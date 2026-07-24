import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const payload = await request.json();
    const eventType = payload?.data?.attributes?.type;

    if (eventType === "checkout_session.payment.paid") {
      const attributes = payload.data.attributes.data.attributes;
      const metadata = attributes.metadata;
      const reservationId = metadata?.reservation_id;

      if (reservationId) {
        // 1. Fetch Reservation details
        const { data: reservation, error: fetchErr } = await supabase
          .from("Reservation")
          .select("*, Inventory(stock)")
          .eq("id", reservationId)
          .single();

        if (!fetchErr && reservation) {
          // 2. Update Reservation Status to Paid / Pending Shipping
          await supabase
            .from("Reservation")
            .update({
              status: "Paid",
              payment_status: "Paid",
              fulfillment_status: "Pending Shipping",
            })
            .eq("id", reservationId);

          // 3. Deduct Purchased Stock from Inventory (for Delivery & Online Payment)
          if (reservation.inventory_id && reservation.quantity) {
            const currentStock = reservation.Inventory?.stock || 0;
            const newStock = Math.max(0, currentStock - reservation.quantity);

            await supabase
              .from("Inventory")
              .update({ stock: newStock })
              .eq("id", reservation.inventory_id);
          }

          // 4. Trigger Nodemailer Email Notification to Admin
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
          await fetch(`${appUrl}/api/notifications/send-order-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reservationId,
              customerName: metadata.customer_name || reservation.customer_name,
              customerEmail: metadata.customer_email || reservation.customer_email,
              productName: reservation.product_name,
              quantity: reservation.quantity,
              totalPrice: reservation.total_price || 0,
              orderType: reservation.order_type || "Delivery",
              paymentMode: "Online (PayMongo GCash)",
              streetAddress: reservation.street_address,
              district: reservation.district,
              zipCode: reservation.zip_code,
              latitude: reservation.latitude,
              longitude: reservation.longitude,
            }),
          });
        }
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("PayMongo Webhook Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
