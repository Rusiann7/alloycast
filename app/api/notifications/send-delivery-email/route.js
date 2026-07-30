import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      reservationId,
      customerName,
      customerEmail,
      contactNumber,
      productName,
      quantity,
      totalPrice,
      shippingAddress,
      district,
      zipCode,
      deliveryType,
      createdAt,
    } = body;

    // --- Admin email sender credentials ---
    const adminEmailUser = process.env.ADMIN_EMAIL_USER || process.env.EMAIL_USER;
    const adminEmailPass =
      process.env.ADMIN_EMAIL_APP_PASSWORD || process.env.EMAIL_APP_PASSWORD;

    if (!adminEmailUser || !adminEmailPass) {
      return NextResponse.json(
        { success: false, error: "Admin email credentials not configured." },
        { status: 500 },
      );
    }

    // --- Fetch all admin emails ---
    const { data: adminUsers } = await supabase
      .from("Users")
      .select("email")
      .eq("is_admin", true);

    const adminEmailList =
      adminUsers && adminUsers.length > 0
        ? adminUsers.map((u) => u.email).filter(Boolean)
        : [process.env.ADMIN_EMAIL || adminEmailUser];

    // --- Admin transporter ---
    const adminTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminEmailUser,
        pass: adminEmailPass,
      },
    });

    const orderDate = createdAt
      ? new Date(createdAt).toLocaleDateString("en-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date().toLocaleDateString("en-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

    // 48hr deadline
    const deadline = new Date(createdAt || Date.now());
    deadline.setHours(deadline.getHours() + 48);
    const deadlineStr = deadline.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const fullAddress = [shippingAddress, district, zipCode]
      .filter(Boolean)
      .join(", ");

    // --- ADMIN EMAIL HTML ---
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #ffffff; margin: 0; padding: 20px; }
          .card { background-color: #1e1e1e; border: 1px solid #f8e408; border-radius: 12px; max-width: 620px; margin: 0 auto; padding: 28px; }
          .header { text-align: center; border-bottom: 2px solid #f8e408; padding-bottom: 16px; margin-bottom: 22px; }
          .header h1 { color: #f8e408; font-size: 22px; text-transform: uppercase; margin: 0; }
          .badge { background-color: #f8e408; color: #000; font-weight: bold; padding: 4px 12px; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 13px; text-transform: uppercase; color: #f8e408; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid rgba(248,228,8,0.2); padding-bottom: 5px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .label { color: #aaaaaa; font-weight: 500; }
          .value { color: #ffffff; font-weight: bold; text-align: right; max-width: 60%; }
          .amount { color: #4CAF50; }
          .action-box { background-color: rgba(248,228,8,0.08); border: 1px solid #f8e408; border-radius: 8px; padding: 16px 18px; margin-top: 20px; font-size: 14px; color: #f8e408; line-height: 1.7; }
          .deadline-box { background-color: rgba(255,80,80,0.10); border: 1px solid #ff5252; border-radius: 8px; padding: 14px 18px; margin-top: 14px; font-size: 13px; color: #ff8a80; line-height: 1.6; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 26px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>AlloyCast — New Delivery Order 🚚</h1>
            <p style="color:#aaaaaa; margin-top:6px; font-size:13px;">
              Order #${reservationId} &nbsp;|&nbsp;
              <span class="badge">Delivery · ${deliveryType} · Online</span>
            </p>
          </div>

          <div class="section">
            <div class="section-title">📦 Product Ordered</div>
            <div class="row"><span class="label">Product Name:</span><span class="value">${productName}</span></div>
            <div class="row"><span class="label">Quantity:</span><span class="value">${quantity} unit(s)</span></div>
            <div class="row"><span class="label">Total Amount:</span><span class="value amount">₱${Number(totalPrice).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            <div class="row"><span class="label">Delivery Type:</span><span class="value">${deliveryType}</span></div>
            <div class="row"><span class="label">Payment Mode:</span><span class="value">Online (Admin-collected)</span></div>
            <div class="row"><span class="label">Order Placed At:</span><span class="value">${orderDate}</span></div>
          </div>

          <div class="section">
            <div class="section-title">👤 Customer Information</div>
            <div class="row"><span class="label">Name:</span><span class="value">${customerName}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${customerEmail || "N/A"}</span></div>
            <div class="row"><span class="label">Contact Number:</span><span class="value">${contactNumber || "N/A"}</span></div>
          </div>

          <div class="section">
            <div class="section-title">📍 Shipping Address</div>
            <div class="row"><span class="label">Address:</span><span class="value">${fullAddress || "N/A"}</span></div>
          </div>

          <div class="action-box">
            ✅ <strong>Action Required</strong><br/><br/>
            Please process this shipment and reply to the customer at <strong>${customerEmail || "their registered email"}</strong> with:<br/>
            &nbsp;&nbsp;• Your <strong>PayMongo payment link</strong>, and/or<br/>
            &nbsp;&nbsp;• Your <strong>GCash QR code</strong><br/><br/>
            The customer may choose their preferred payment method. Once confirmed, update the <strong>payment_status</strong> to <strong>"Paid"</strong> in the system.
          </div>

          <div class="deadline-box">
            ⏳ <strong>48-Hour Payment Deadline</strong><br/>
            If the customer has not paid by <strong>${deadlineStr}</strong>, the order <strong>payment_status</strong> will automatically be updated to <strong>"Failed"</strong>.
            <br/>No stock deduction or revenue recording will occur until payment is confirmed.
          </div>

          <div class="footer">
            <p>AlloyCast Automated Inventory &amp; Fulfillment System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to all admins
    await adminTransporter.sendMail({
      from: `"AlloyCast Store" <${adminEmailUser}>`,
      to: adminEmailList.join(","),
      subject: `🚚 [New Delivery Order #${reservationId}] ${customerName} — Door-to-Door · Online Payment`,
      html: adminHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Delivery order notification sent to admin(s).",
    });
  } catch (error) {
    console.error("Delivery Email Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
