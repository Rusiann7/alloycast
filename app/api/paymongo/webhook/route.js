import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
          .select(
            "*, Inventory(item_name, price, stock), Users(email, phone_number)",
          )
          .eq("id", reservationId)
          .single();

        if (!fetchErr && reservation) {
          // Fetch Customer firstname & lastname
          const { data: custData } = await supabase
            .from("Customer")
            .select("firstname, lastname")
            .eq("user_id", reservation.user_id)
            .maybeSingle();

          const customerFullName = custData
            ? `${custData.firstname || ""} ${custData.lastname || ""}`.trim()
            : metadata?.customer_name || "Valued Customer";

          // 2. Update Reservation Status to Paid / Pending Shipping
          await supabase
            .from("Reservation")
            .update({
              status: "Paid",
              payment_status: "Paid",
              fulfillment_status: "Pending Shipping",
              paymongo_session_id: payload?.data?.id || null,
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
          const appUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
          const totalPrice =
            (reservation.Inventory?.price || 0) * (reservation.quantity || 1);

          await fetch(`${appUrl}/api/notifications/send-order-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reservationId,
              customerName: customerFullName,
              customerEmail:
                reservation.Users?.email || metadata?.customer_email || "",
              contactNumber: reservation.Users?.phone_number || "",
              productName:
                reservation.Inventory?.item_name || "Diecast Product",
              quantity: reservation.quantity,
              totalPrice,
              orderType: reservation.order_type || "Delivery",
              paymentMode: "Online (PayMongo GCash)",
              shippingAddress: reservation.shipping_address,
              district: reservation.district,
              zipCode: reservation.zip_code,
              latitude: reservation.latitude,
              longtitude: reservation.longtitude,
            }),
          });
        }
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("PayMongo Webhook Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
