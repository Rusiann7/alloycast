import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

// Use service role key to bypass RLS policies on Users / Reservation tables in API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { reservationId, shippingFee, trackingNumber, customerEmail: bodyEmail } = body;

    console.log("[send-shipment-email] Processing reservationId:", reservationId, "shippingFee:", shippingFee);

    if (!reservationId) {
      return NextResponse.json(
        { success: false, error: "Reservation ID is required." },
        { status: 400 },
      );
    }

    // 1. Fetch complete reservation and inventory details
    const { data: reservation, error: resError } = await supabase
      .from("Reservation")
      .select("*, Inventory(item_name, price, discount)")
      .eq("id", reservationId)
      .single();

    if (resError || !reservation) {
      console.error("[send-shipment-email] Reservation fetch error:", resError);
      return NextResponse.json(
        { success: false, error: "Reservation not found in database." },
        { status: 404 },
      );
    }

    // 2. Fetch User email explicitly using user_id
    let customerEmail = bodyEmail || "";
    let phoneNumber = "";

    if (!customerEmail && reservation.user_id) {
      const { data: userData, error: userError } = await supabase
        .from("Users")
        .select("email, phone_number")
        .eq("id", reservation.user_id)
        .maybeSingle();

      if (userError) {
        console.error("[send-shipment-email] Users query error:", userError);
      }

      if (userData) {
        customerEmail = userData.email || "";
        phoneNumber = userData.phone_number || "";
      }
    }

    // 3. Fetch Customer name
    const { data: customer } = await supabase
      .from("Customer")
      .select("firstname, lastname")
      .eq("user_id", reservation.user_id)
      .maybeSingle();

    const customerName = customer
      ? `${customer.firstname || ""} ${customer.lastname || ""}`.trim()
      : "Valued Customer";

    if (!customerEmail) {
      console.error("[send-shipment-email] Customer email missing for user_id:", reservation.user_id);
      return NextResponse.json(
        { success: false, error: "Customer email not found for this reservation." },
        { status: 400 },
      );
    }

    // Calculate product price, quantity, and total
    const itemPrice = reservation.Inventory?.discount
      ? Number(reservation.Inventory.price) - Number(reservation.Inventory.discount)
      : Number(reservation.Inventory?.price || 0);
    const quantity = parseInt(reservation.quantity, 10) || 1;
    const productsCost = itemPrice * quantity;
    const finalTotal = productsCost + (parseFloat(shippingFee) || 0);

    console.log(`[send-shipment-email] Email: ${customerEmail}, Total: ₱${finalTotal} (Products: ₱${productsCost}, Shipping: ₱${shippingFee})`);

    // 4. Call PayMongo to generate checkout session URL
    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      console.error("[send-shipment-email] PAYMONGO_SECRET_KEY missing!");
      return NextResponse.json(
        { success: false, error: "PayMongo secret key is not configured in server environment." },
        { status: 500 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const amountInCentavos = Math.round(finalTotal * 100);
    const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;

    const paymongoRes = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            billing: {
              name: customerName,
              email: customerEmail,
              phone: phoneNumber || undefined,
            },
            line_items: [
              {
                currency: "PHP",
                amount: amountInCentavos,
                description: `AlloyCast - Order #${reservationId} (Products + Shipping)`,
                name: `${reservation.Inventory?.item_name || "Product"} x${quantity} + Shipping`,
                quantity: 1,
              },
            ],
            payment_method_types: ["card", "gcash", "paymaya", "qrph"],
            success_url: `${appUrl}/customer/productDetail?payment=success&reservation_id=${reservationId}`,
            cancel_url: `${appUrl}/customer/productDetail?payment=cancelled&reservation_id=${reservationId}`,
            description: `Order #${reservationId} payment for ${customerName}`,
            metadata: {
              reservation_id: String(reservationId),
              customer_name: customerName,
              customer_email: customerEmail,
            },
          },
        },
      }),
    });

    const sessionData = await paymongoRes.json();

    if (!paymongoRes.ok) {
      console.error("[send-shipment-email] PayMongo Error:", sessionData);
      return NextResponse.json(
        { success: false, error: sessionData.errors?.[0]?.detail || "PayMongo session creation failed." },
        { status: paymongoRes.status },
      );
    }

    const checkoutUrl = sessionData.data.attributes.checkout_url;
    const checkoutSessionId = sessionData.data.id;

    console.log("[send-shipment-email] PayMongo checkout URL created:", checkoutUrl);

    // 5. Update the Reservation record
    const { error: updateError } = await supabase
      .from("Reservation")
      .update({
        shipping_fee: parseFloat(shippingFee) || 0,
        tracking_number: trackingNumber || "",
        fulfillment_status: "Shipped",
        paymongo_session_id: checkoutSessionId,
      })
      .eq("id", reservationId);

    if (updateError) {
      console.error("[send-shipment-email] Reservation update error:", updateError);
      throw updateError;
    }

    // 6. Send email using Nodemailer
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPass) {
      console.error("[send-shipment-email] EMAIL_USER or EMAIL_APP_PASSWORD missing!");
      return NextResponse.json(
        { success: false, error: "Nodemailer credentials not configured on server." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #ffffff; margin: 0; padding: 20px; }
          .card { background-color: #1e1e1e; border: 1px solid #f8e408; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 24px; }
          .header { text-align: center; border-bottom: 2px solid #f8e408; padding-bottom: 16px; margin-bottom: 20px; }
          .header h1 { color: #f8e408; font-size: 22px; text-transform: uppercase; margin: 0; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 14px; text-transform: uppercase; color: #f8e408; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid rgba(248, 228, 8, 0.2); padding-bottom: 4px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
          .label { color: #aaaaaa; font-weight: 500; }
          .value { color: #ffffff; font-weight: bold; }
          .btn-container { text-align: center; margin: 24px 0; }
          .btn { background-color: #f8e408; color: #000000; text-decoration: none; font-weight: bold; padding: 14px 32px; border-radius: 8px; font-size: 15px; text-transform: uppercase; display: inline-block; box-shadow: 0 4px 15px rgba(248, 228, 8, 0.4); }
          .footer { text-align: center; font-size: 12px; color: #666666; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>Shipment Processed! 🚚</h1>
            <p style="color: #aaaaaa; margin-top: 6px; font-size: 13px;">
              Hi ${customerName}, your order #${reservationId} has been shipped and is ready for payment.
            </p>
          </div>

          <div class="section">
            <div class="section-title">📦 Shipment Summary</div>
            <div class="row"><span class="label">Product Name:</span><span class="value">${reservation.Inventory?.item_name || "Product"} (x${quantity})</span></div>
            <div class="row"><span class="label">Products Cost:</span><span class="value">₱${Number(productsCost).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            <div class="row"><span class="label">Shipping Fee:</span><span class="value">₱${Number(shippingFee || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            <div class="row" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; margin-top: 8px;"><span class="label" style="color: #f8e408;">Total Amount Due:</span><span class="value" style="color: #4CAF50; font-size: 16px;">₱${Number(finalTotal).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            <div class="row"><span class="label">Tracking Number:</span><span class="value">${trackingNumber || "N/A"}</span></div>
          </div>

          <div class="btn-container">
            <a href="${checkoutUrl}" class="btn">Pay Online Now</a>
          </div>

          <div class="footer">
            <p>Thank you for shopping at AlloyCast! — AlloyCast Automated Inventory &amp; Fulfillment System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`[send-shipment-email] Sending email from ${emailUser} to ${customerEmail}...`);

    const mailResult = await transporter.sendMail({
      from: `"AlloyCast Store" <${emailUser}>`,
      to: customerEmail,
      subject: `🚚 Pay for Shipment - Order #${reservationId} at AlloyCast`,
      html: customerHtml,
    });

    console.log("[send-shipment-email] Email sent successfully! MessageId:", mailResult.messageId);

    return NextResponse.json({
      success: true,
      message: "Shipment payment link generated and email sent successfully.",
      checkoutUrl,
    });
  } catch (error) {
    console.error("[send-shipment-email] Server Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
