import nodemailer from "nodemailer";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// POST /api/reset-password
// Body: { email: string }
// Generates a 5-digit code, stores a hash in `password_resets` table, and emails the code.

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Env checks
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Missing Supabase config" },
        { status: 500 },
      );
    }
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json(
        { error: "Missing SMTP config" },
        { status: 500 },
      );
    }

    // Generate a 5-digit numeric code
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // Hash the code with a server-side secret
    const secret =
      process.env.RESET_CODE_SECRET || SUPABASE_SERVICE_ROLE_KEY.slice(0, 32);
    const tokenHash = crypto
      .createHmac("sha256", secret)
      .update(code)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Insert into Supabase password_resets table
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { error: insertError } = await supabase
      .from("password_resets") // dapat sa SUPABASE AUTHENTICATION NYA KUKUNIN UNG PASSWORD
      .insert([
        {
          email,
          token_hash: tokenHash,
          expires_at: expiresAt,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Send email with nodemailer
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || SMTP_USER,
      to: email,
      subject: "Your password reset code",
      text: `Your password reset code is: ${code} \nIt will expire in 1 hour. If you didn't request this, ignore this email.`,
      html: `<p>Your password reset code is: <strong>${code}</strong></p><p>This code will expire in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
