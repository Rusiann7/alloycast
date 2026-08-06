import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      amount, // In PHP (e.g. 500)
      item_name,
      quantity,
      reservation_id,
      customer_name,
      customer_email,
      contact_number,
      shipping_address,
      street_address,
      district,
      zip_code,
    } = body;

    const actualAddress = shipping_address || street_address || "";

    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "PayMongo secret key is not configured in server environment.",
        },
        { status: 500 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Amount in PayMongo must be in centavos (e.g. PHP 500.00 = 50000)
    const amountInCentavos = Math.round(amount * 100);

    // Clean phone number (remove non-digits, format to +63 or 09 format)
    let formattedPhone = undefined;
    if (contact_number) {
      const digitsOnly = String(contact_number).replace(/\D/g, "");
      if (digitsOnly.length >= 10) {
        formattedPhone = digitsOnly.startsWith("63")
          ? `+${digitsOnly}`
          : digitsOnly.startsWith("0")
            ? `+63${digitsOnly.slice(1)}`
            : `+63${digitsOnly}`;
      }
    }

    // Build clean address object for PayMongo billing
    const billingAddress = {
      country: "PH",
    };
    if (actualAddress && actualAddress.trim())
      billingAddress.line1 = actualAddress.trim();
    if (district && district.trim()) billingAddress.city = district.trim();
    if (zip_code && String(zip_code).trim())
      billingAddress.postal_code = String(zip_code).trim();

    const payload = {
      data: {
        attributes: {
          billing: {
            name: customer_name || "AlloyCast Customer",
            email: customer_email || undefined,
            phone: formattedPhone || undefined,
            address: billingAddress,
          },
          line_items: [
            {
              currency: "PHP",
              amount: amountInCentavos,
              description: `AlloyDash - ${item_name}`,
              name: item_name,
              quantity: parseInt(quantity, 10) || 1,
            },
          ],
          payment_method_types: ["card", "gcash", "paymaya", "qrph"],
          success_url: `${appUrl}/customer/productDetail?payment=success&reservation_id=${reservation_id}`,
          cancel_url: `${appUrl}/customer/productDetail?payment=cancelled&reservation_id=${reservation_id}`,
          description: `Order #${reservation_id} for ${customer_name}`,
          metadata: {
            reservation_id: String(reservation_id),
            customer_name,
            customer_email,
          },
        },
      },
    };

    const authHeader = `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;

    const paymongoRes = await fetch(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await paymongoRes.json();

    if (!paymongoRes.ok) {
      console.error("PayMongo Error:", data);
      return NextResponse.json(
        {
          success: false,
          error:
            data.errors?.[0]?.detail || "PayMongo session creation failed.",
        },
        { status: paymongoRes.status },
      );
    }

    const checkoutUrl = data.data.attributes.checkout_url;
    const checkoutSessionId = data.data.id;

    return NextResponse.json({
      success: true,
      checkout_url: checkoutUrl,
      checkout_session_id: checkoutSessionId,
    });
  } catch (error) {
    console.error("PayMongo API Route Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
