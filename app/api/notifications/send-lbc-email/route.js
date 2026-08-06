import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * POST /api/notifications/send-lbc-email
 *
 * Sends an admin-only order-summary email for LBC Local Branch + Cash orders.
 * The admin will:
 *  1. Go to LBC and pay the shipping fee.
 *  2. Reply to the customer with (product cost + shipping fee).
 *  3. Notify the customer when the parcel is ready for pickup at their LBC branch.
 *  4. Mark fulfillment_status → "Shipped" once customer claims it.
 *  5. Mark fulfillment_status → "Completed" once LBC remits cash to admin.
 */
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
      createdAt,
    } = body;

    // --- Admin email sender credentials ---
    const adminEmailUser =
      process.env.ADMIN_EMAIL_USER || process.env.EMAIL_USER;
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

    const orderDate = new Date(createdAt || Date.now()).toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );

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
          .card { background-color: #1e1e1e; border: 1px solid #f8e408; border-radius: 12px; max-width: 640px; margin: 0 auto; padding: 28px; }
          .header { text-align: center; border-bottom: 2px solid #f8e408; padding-bottom: 16px; margin-bottom: 22px; }
          .header h1 { color: #f8e408; font-size: 22px; text-transform: uppercase; margin: 0; }
          .badge { background-color: #f8e408; color: #000; font-weight: bold; padding: 4px 12px; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 13px; text-transform: uppercase; color: #f8e408; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid rgba(248,228,8,0.2); padding-bottom: 5px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .label { color: #aaaaaa; font-weight: 500; }
          .value { color: #ffffff; font-weight: bold; text-align: right; max-width: 60%; }
          .amount { color: #4CAF50; }
          .steps-box { background-color: rgba(248,228,8,0.06); border: 1px solid rgba(248,228,8,0.5); border-radius: 10px; padding: 18px 20px; margin-top: 20px; }
          .steps-box h3 { color: #f8e408; font-size: 14px; text-transform: uppercase; margin: 0 0 14px 0; letter-spacing: 0.05em; }
          .step { display: flex; align-items: flex-start; margin-bottom: 12px; font-size: 14px; line-height: 1.55; }
          .step-num { background-color: #f8e408; color: #000; font-weight: bold; border-radius: 50%; min-width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 12px; margin-top: 1px; }
          .step-text { color: #dddddd; }
          .step-text strong { color: #ffffff; }
          .highlight { color: #f8e408; font-weight: bold; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 26px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>AlloyDash — New LBC Delivery Order 📦</h1>
            <p style="color:#aaaaaa; margin-top:6px; font-size:13px;">
              Order #${reservationId} &nbsp;|&nbsp;
              <span class="badge">LBC Local Branch · Cash</span>
            </p>
          </div>

          <div class="section">
            <div class="section-title">📦 Product Ordered</div>
            <div class="row"><span class="label">Product Name:</span><span class="value">${productName}</span></div>
            <div class="row"><span class="label">Quantity:</span><span class="value">${quantity} unit(s)</span></div>
            <div class="row"><span class="label">Product Cost:</span><span class="value amount">₱${Number(totalPrice).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span></div>
            <div class="row"><span class="label">Delivery Type:</span><span class="value">LBC Local Branch (Cash)</span></div>
            <div class="row"><span class="label">Payment Mode:</span><span class="value">Cash on LBC Pickup</span></div>
            <div class="row"><span class="label">Order Placed At:</span><span class="value">${orderDate}</span></div>
          </div>

          <div class="section">
            <div class="section-title">👤 Customer Information</div>
            <div class="row"><span class="label">Name:</span><span class="value">${customerName}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${customerEmail || "N/A"}</span></div>
            <div class="row"><span class="label">Contact Number:</span><span class="value">${contactNumber || "N/A"}</span></div>
          </div>

          ${
            fullAddress
              ? `
          <div class="section">
            <div class="section-title">📍 Customer's LBC Branch / Address</div>
            <div class="row"><span class="label">Address:</span><span class="value">${fullAddress}</span></div>
          </div>`
              : ""
          }

          <div class="steps-box">
            <h3>✅ Action Checklist for Admin</h3>

            <div class="step">
              <div class="step-num">1</div>
              <div class="step-text">
                Prepare and pack the item(s) for <strong>${productName}</strong> (Qty: ${quantity}).
              </div>
            </div>

            <div class="step">
              <div class="step-num">2</div>
              <div class="step-text">
                Go to your nearest <strong>LBC branch</strong> and ship the package to the customer's LBC branch.
                You will pay the <strong>shipping fee upfront</strong>.
              </div>
            </div>

            <div class="step">
              <div class="step-num">3</div>
              <div class="step-text">
                Reply to the customer at <span class="highlight">${customerEmail || "their registered email"}</span> with:
                <br/>• Product cost: <strong class="highlight">₱${Number(totalPrice).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</strong>
                <br/>• Shipping fee amount (your actual LBC receipt)
                <br/>• <strong>Total amount</strong> the customer must pay at LBC pickup
                <br/>• LBC tracking number
              </div>
            </div>

            <div class="step">
              <div class="step-num">4</div>
              <div class="step-text">
                Update the reservation <strong>fulfillment_status → "Pending Shipping"</strong> in the system dashboard once shipped.
              </div>
            </div>

            <div class="step">
              <div class="step-num">5</div>
              <div class="step-text">
                When the parcel arrives at the customer's LBC branch, <strong>notify the customer</strong> via email/reply that their order is ready for pickup. Update <strong>fulfillment_status → "Shipped"</strong>.
              </div>
            </div>

            <div class="step">
              <div class="step-num">6</div>
              <div class="step-text">
                Once <strong>LBC remits the cash</strong> to you (product cost + shipping), update <strong>fulfillment_status → "Completed"</strong> and <strong>payment_status → "Paid"</strong> in the system.
              </div>
            </div>
          </div>

          <div class="footer">
            <p>AlloyDash Automated Inventory &amp; Fulfillment System &nbsp;|&nbsp; Order #${reservationId}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to all admins
    await adminTransporter.sendMail({
      from: `"AlloyDash Store" <${adminEmailUser}>`,
      to: adminEmailList.join(","),
      subject: `📦 [New LBC Order #${reservationId}] ${customerName} — LBC Local Branch · Cash`,
      html: adminHtml,
    });

    return NextResponse.json({
      success: true,
      message: "LBC order notification sent to admin(s).",
    });
  } catch (error) {
    console.error("LBC Email Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
