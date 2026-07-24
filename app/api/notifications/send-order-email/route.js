import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      reservationId,
      customerName,
      contactNumber,
      customerEmail,
      productName,
      quantity,
      totalPrice,
      orderType,
      paymentMode,
      streetAddress,
      district,
      zipCode,
      latitude,
      longitude,
    } = body;

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL || emailUser;

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        { success: false, error: "Nodemailer credentials not configured." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const googleMapsUrl = latitude && longitude
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : null;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #ffffff; margin: 0; padding: 20px; }
          .card { background-color: #1e1e1e; border: 1px solid #f8e408; border-radius: 12px; max-width: 600px; margin: 0 auto; padding: 24px; }
          .header { text-align: center; border-bottom: 2px solid #f8e408; padding-bottom: 16px; margin-bottom: 20px; }
          .header h1 { color: #f8e408; font-size: 22px; text-transform: uppercase; margin: 0; }
          .badge { background-color: #f8e408; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase; }
          .section { margin-bottom: 18px; }
          .section-title { font-size: 14px; text-transform: uppercase; color: #f8e408; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid rgba(248, 228, 8, 0.2); padding-bottom: 4px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
          .label { color: #aaaaaa; font-weight: 500; }
          .value { color: #ffffff; font-weight: bold; }
          .btn-maps { display: inline-block; background-color: #f8e408; color: #000000; text-decoration: none; font-weight: bold; padding: 10px 16px; border-radius: 6px; font-size: 13px; text-transform: uppercase; margin-top: 10px; }
          .footer { text-align: center; font-size: 12px; color: #666666; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>AlloyCast - New Order Alert</h1>
            <p style="color: #aaaaaa; margin-top: 6px; font-size: 13px;">Order #${reservationId} - <span class="badge">${orderType} (${paymentMode})</span></p>
          </div>

          <div class="section">
            <div class="section-title">📦 Purchased Product</div>
            <div class="row"><span class="label">Product Name:</span><span class="value">${productName}</span></div>
            <div class="row"><span class="label">Quantity:</span><span class="value">${quantity} unit(s)</span></div>
            <div class="row"><span class="label">Total Amount Paid:</span><span class="value" style="color: #4CAF50;">₱${totalPrice}</span></div>
          </div>

          <div class="section">
            <div class="section-title">👤 Customer Information</div>
            <div class="row"><span class="label">Name:</span><span class="value">${customerName}</span></div>
            <div class="row"><span class="label">Contact Phone:</span><span class="value">${contactNumber || 'N/A'}</span></div>
            <div class="row"><span class="label">Email:</span><span class="value">${customerEmail || 'N/A'}</span></div>
          </div>

          ${orderType === 'Delivery' ? `
          <div class="section">
            <div class="section-title">📍 Shipping & Delivery Address</div>
            <div class="row"><span class="label">Street Address:</span><span class="value">${streetAddress || 'N/A'}</span></div>
            <div class="row"><span class="label">District / Barangay:</span><span class="value">${district || 'N/A'}</span></div>
            <div class="row"><span class="label">Zip Code:</span><span class="value">${zipCode || 'N/A'}</span></div>
            ${googleMapsUrl ? `
              <div style="text-align: center; margin-top: 12px;">
                <a href="${googleMapsUrl}" target="_blank" class="btn-maps">📍 Open Pinned Location on Google Maps</a>
              </div>
            ` : ''}
          </div>
          ` : ''}

          <div class="footer">
            <p>AlloyCast Automated Inventory & Fulfillment System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"AlloyCast Store" <${emailUser}>`,
      to: adminEmail,
      subject: `🚨 [New Order #${reservationId}] ${orderType} - ${customerName}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, message: "Order notification email sent successfully." });
  } catch (error) {
    console.error("Nodemailer Email Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
