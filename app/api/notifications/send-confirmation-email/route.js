import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function POST(request) {
  try {
    const { reservationId } = await request.json();

    if (!reservationId) {
      return NextResponse.json(
        { success: false, error: "Reservation ID is required." },
        { status: 400 },
      );
    }

    const { data: reservation, error: reservationError } = await supabase
      .from("Reservation")
      .select(
        "id, quantity, created_at, fulfillment_status, user_id, Inventory(item_name, price, discount)",
      )
      .eq("id", reservationId)
      .single();

    if (reservationError || !reservation) {
      return NextResponse.json(
        { success: false, error: "Reservation not found." },
        { status: 404 },
      );
    }

    const [{ data: customer }, { data: customerUser }, { data: adminUsers }] =
      await Promise.all([
        supabase
          .from("Customer")
          .select("firstname, lastname")
          .eq("user_id", reservation.user_id)
          .maybeSingle(),
        supabase
          .from("Users")
          .select("email")
          .eq("id", reservation.user_id)
          .maybeSingle(),
        supabase.from("Users").select("email").eq("is_admin", true),
      ]);

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;
    const adminEmailList = (adminUsers || [])
      .map((user) => user.email)
      .filter(Boolean);
    const recipients = adminEmailList.length
      ? adminEmailList
      : [process.env.ADMIN_EMAIL || emailUser].filter(Boolean);

    if (!emailUser || !emailPass || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: "Admin email configuration is missing." },
        { status: 500 },
      );
    }

    const customerName = customer
      ? `${customer.firstname || ""} ${customer.lastname || ""}`.trim()
      : "Valued Customer";
    const productName = reservation.Inventory?.item_name || "Product";
    const quantity = Number(reservation.quantity) || 1;
    const price = reservation.Inventory?.discount
      ? Number(reservation.Inventory.price) -
        Number(reservation.Inventory.discount)
      : Number(reservation.Inventory?.price || 0);
    const total = price * quantity;
    const orderDate = new Date(reservation.created_at).toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });

    await transporter.sendMail({
      from: `"AlloyDash Store" <${emailUser}>`,
      to: recipients.join(","),
      subject: `✅ [Order #${reservation.id}] Customer Confirmed Delivery`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background:#121212; color:#fff; margin:0; padding:20px; }
          .card { background:#1e1e1e; border:1px solid #f8e408; border-radius:12px; max-width:600px; margin:0 auto; padding:24px; }
          .header { text-align:center; border-bottom:2px solid #f8e408; padding-bottom:16px; margin-bottom:20px; }
          h1 { color:#f8e408; font-size:22px; text-transform:uppercase; margin:0; }
          .section-title { color:#f8e408; font-weight:bold; text-transform:uppercase; border-bottom:1px solid rgba(248,228,8,.2); padding-bottom:5px; margin-bottom:10px; }
          .row { display:flex; justify-content:space-between; gap:16px; margin-bottom:8px; font-size:14px; }
          .label { color:#aaa; } .value { color:#fff; font-weight:bold; text-align:right; }
          .status { color:#4CAF50; font-weight:bold; } .footer { text-align:center; font-size:12px; color:#666; margin-top:24px; }
        </style></head>
        <body><div class="card">
          <div class="header">
            <h1>Order Confirmed ✅</h1>
            <p style="color:#aaa; margin:6px 0 0; font-size:13px;">The customer confirmed receipt of order #${reservation.id}.</p>
          </div>
          <div>
            <div class="section-title">📦 Order Summary</div>
            <div class="row"><span class="label">Product Name:</span><span class="value">${productName}</span></div>
            <div class="row"><span class="label">Quantity:</span><span class="value">${quantity} unit(s)</span></div>
            <div class="row"><span class="label">Product Total:</span><span class="value">₱${total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            <div class="row"><span class="label">Customer:</span><span class="value">${customerName}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${customerUser?.email || "N/A"}</span></div>
            <div class="row"><span class="label">Confirmed At:</span><span class="value">${orderDate}</span></div>
            <div class="row"><span class="label">Fulfillment Status:</span><span class="status">Confirmed</span></div>
          </div>
          <div class="footer"><p>AlloyDash Automated Inventory &amp; Fulfillment System</p></div>
        </div></body></html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Confirmation sent to admin(s).",
    });
  } catch (error) {
    console.error("[send-confirmation-email] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
