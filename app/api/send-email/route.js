import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { to_email, customerName, productName, reasonCancellation } =
      await request.json();

    // middleman
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const emailSubject = `Reservation Declined: ${productName}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #C8102E; text-transform: uppercase;">Reservation Update</h2>
        <p>Hello <strong>${customerName}</strong>,</p>
        <p>We regret to inform you that your reservation for the item <strong>${productName}</strong> has been <strong>Declined / Cancelled</strong> by our administrators.</p>
        
        <div style="background-color: #fcf8f8; border-left: 4px solid #C8102E; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <strong style="color: #C8102E; text-transform: uppercase; font-size: 12px; tracking-widest: 1px;">Reason for Cancellation:</strong>
          <p style="margin: 8px 0 0 0; font-style: italic; color: #555; font-size: 15px;">"${reasonCancellation || "Other reasons..."}"</p>
        </div>
        
        <p>Thank you for your understanding. If you have any questions or would like to reserve another product, please feel free to browse our catalogue or reply directly to this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 11px; color: #999; text-align: center; text-transform: uppercase;">This is an automated notification from AlloyDash Admin.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"AlloyDash Admin" <${process.env.EMAIL_USER}>`,
      to: to_email,
      subject: emailSubject,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Cancellation email sent successfully!",
    });
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
