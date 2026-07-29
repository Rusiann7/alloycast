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
      orderType,
      paymentMode,
      createdAt,
    } = body;

    // --- Customer email sender credentials ---
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;

    // --- Admin email sender credentials (separate account) ---
    const adminEmailUser = process.env.ADMIN_EMAIL_USER || emailUser;
    const adminEmailPass = process.env.ADMIN_EMAIL_APP_PASSWORD || emailPass;

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        { success: false, error: "Nodemailer credentials not configured." },
        { status: 500 },
      );
    }

    // --- Fetch all admin emails from Supabase where is_admin = true ---
    const { data: adminUsers, error: adminErr } = await supabase
      .from("Users")
      .select("email")
      .eq("is_admin", true);

    const adminEmailList =
      adminUsers && adminUsers.length > 0
        ? adminUsers.map((u) => u.email).filter(Boolean)
        : [process.env.ADMIN_EMAIL || emailUser];

    // --- Transporter for sending TO customers (from store account) ---
    const customerTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // --- Transporter for sending TO admins (from admin account) ---
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

    // --- ADMIN EMAIL HTML ---
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #ffffff; margin: 0; padding: 20px; }
          .card { background-color: #1e1e1e; border: 1px solid #f8e408; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 24px; }
          .header { text-align: center; border-bottom: 2px solid #f8e408; padding-bottom: 16px; margin-bottom: 20px; }
          .header h1 { color: #f8e408; font-size: 22px; text-transform: uppercase; margin: 0; }
          .badge { background-color: #f8e408; color: #000; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 14px; text-transform: uppercase; color: #f8e408; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid rgba(248, 228, 8, 0.2); padding-bottom: 4px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
          .label { color: #aaaaaa; font-weight: 500; }
          .value { color: #ffffff; font-weight: bold; }
          .alert-box { background-color: rgba(248, 228, 8, 0.1); border: 1px solid #f8e408; border-radius: 8px; padding: 12px 16px; margin-top: 16px; font-size: 13px; color: #f8e408; }
          .footer { text-align: center; font-size: 12px; color: #666666; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>AlloyCast — New Pickup Order</h1>
            <p style="color: #aaaaaa; margin-top: 6px; font-size: 13px;">
              Order #${reservationId} &nbsp;|&nbsp; <span class="badge">${orderType} · ${paymentMode}</span>
            </p>
          </div>

          <div class="section">
            <div class="section-title">📦 Product Ordered</div>
            <div class="row"><span class="label">Product Name:</span><span class="value">${productName}</span></div>
            <div class="row"><span class="label">Quantity:</span><span class="value">${quantity} unit(s)</span></div>
            <div class="row"><span class="label">Total Amount:</span><span class="value" style="color: #4CAF50;">₱${Number(totalPrice).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            <div class="row"><span class="label">Payment Mode:</span><span class="value">${paymentMode}</span></div>
            <div class="row"><span class="label">Order Placed At:</span><span class="value">${orderDate}</span></div>
          </div>

          <div class="section">
            <div class="section-title">👤 Customer Information</div>
            <div class="row"><span class="label">Name:</span><span class="value">${customerName}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${customerEmail || "N/A"}</span></div>
            <div class="row"><span class="label">Contact Number:</span><span class="value">${contactNumber || "N/A"}</span></div>
          </div>

          <div class="alert-box">
            ⚠️ This customer has a <strong>48-hour window</strong> to visit the store and complete their pickup purchase (in-store cash payment). If not completed within 48 hours, the reservation should be <strong>cancelled</strong>.
          </div>

          <div class="footer">
            <p>AlloyCast Automated Inventory &amp; Fulfillment System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // --- CUSTOMER EMAIL HTML ---
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
          .badge { background-color: #f8e408; color: #000; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 14px; text-transform: uppercase; color: #f8e408; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid rgba(248, 228, 8, 0.2); padding-bottom: 4px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
          .label { color: #aaaaaa; font-weight: 500; }
          .value { color: #ffffff; font-weight: bold; }
          .warning-box { background-color: rgba(255, 80, 80, 0.12); border: 1px solid #ff5252; border-radius: 8px; padding: 14px 18px; margin-top: 18px; font-size: 14px; color: #ff8a80; line-height: 1.6; }
          .warning-box strong { color: #ff5252; }
          .info-box { background-color: rgba(248, 228, 8, 0.08); border: 1px solid rgba(248, 228, 8, 0.3); border-radius: 8px; padding: 12px 16px; margin-top: 14px; font-size: 13px; color: #f8e408; }
          .footer { text-align: center; font-size: 12px; color: #666666; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>Order Reserved! 🎉</h1>
            <p style="color: #aaaaaa; margin-top: 6px; font-size: 13px;">
              Hi <strong style="color: #f8e408;">${customerName}</strong>, your pickup order has been reserved!
            </p>
          </div>

          <div class="section">
            <div class="section-title">📦 Your Order Summary</div>
            <div class="row"><span class="label">Order Reference #:</span><span class="value">#${reservationId}</span></div>
            <div class="row"><span class="label">Product:</span><span class="value">${productName}</span></div>
            <div class="row"><span class="label">Quantity:</span><span class="value">${quantity} unit(s)</span></div>
            <div class="row"><span class="label">Total Amount to Pay:</span><span class="value" style="color: #4CAF50;">₱${Number(totalPrice).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            <div class="row"><span class="label">Order Type:</span><span class="value">${orderType}</span></div>
            <div class="row"><span class="label">Payment Mode:</span><span class="value">${paymentMode} (pay in-store)</span></div>
            <div class="row"><span class="label">Reserved At:</span><span class="value">${orderDate}</span></div>
          </div>

          <div class="warning-box">
            ⏳ <strong>48-Hour Pickup Reminder</strong><br/><br/>
            You have <strong>48 hours</strong> from the time of reservation to visit our store and complete your purchase via cash payment.<br/><br/>
            If you fail to pick up and pay for the item within this window, your reservation will be <strong>automatically cancelled</strong> and the item will be made available to other customers.
          </div>

          <div class="info-box">
            📍 Please visit the <strong>AlloyCast Store</strong> and present your Order Reference Number <strong>#${reservationId}</strong> to our staff to complete your purchase.
          </div>

          <div class="footer">
            <p>Thank you for shopping at AlloyCast! — AlloyCast Automated Inventory &amp; Fulfillment System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to Admin (to all admins)
    await adminTransporter.sendMail({
      from: `"AlloyCast Store" <${adminEmailUser}>`,
      to: adminEmailList.join(","),
      subject: `🛒 [New Pickup Order #${reservationId}] ${customerName} — Cash Payment`,
      html: adminHtml,
    });

    // Send to Customer (only if email is available)
    if (customerEmail) {
      await transporter.sendMail({
        from: `"AlloyCast Store" <${emailUser}>`,
        to: customerEmail,
        subject: `✅ Your AlloyCast Pickup Order #${reservationId} is Reserved — Pick Up Within 48 Hours`,
        html: customerHtml,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Pickup order emails sent successfully.${!customerEmail ? " (Admin only — no customer email available)" : ""}`,
    });
  } catch (error) {
    console.error("Pickup Email Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
