import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { to_email, code } = await request.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const emailSubject = `Password Reset`;
    const emailHtml = `<div
      style="
        font-family: Arial, sans-serif;
        padding: 20px;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        border: 1px solid #eee;
        border-radius: 8px;
      "
    >
      <h2 style="color: #0c3e9c; text-transform: uppercase">RESET PASSWORD</h2>
      <p>Hello <strong>${to_email}!</strong>,</p>
      <p>
        A reset password request has been sent to you. Enter the code to reset
        your password
      </p>

      <div
        style="
          background-color: #fcf8f8;
          border-left: 4px solid #0c3e9c;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        "
      >
        <strong
          style="
            color: #0c3e9c;
            text-transform: uppercase;
            font-size: 12px;
            tracking-widest: 1px;
          "
          >Code:</strong
        >
        <p
          style="
            margin: 8px 0 0 0;
            font-style: italic;
            color: #555;
            font-size: 15px;
          "
        >
          "${code}"
        </p>
      </div>

      <center>
        <p>
          If you didn't request this, please ignore this email.
          <br />
          <br />
          Your password won't change until you proceed with the reset password
          process. <br />
          <br />
          Have a great day!
        </p>
      </center>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0" />
      <p
        style="
          font-size: 11px;
          color: #999;
          text-align: center;
          text-transform: uppercase;
        "
      >
        This is an automated notification from AlloyDash Admin.
      </p>
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
      message: "Reset password was sent successfully!",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
