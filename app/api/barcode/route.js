import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const upc = searchParams.get("upc");

  if (!upc) {
    return NextResponse.json({ error: "UPC is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`,
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Barcode proxy error: ", error);
    return NextResponse.json(
      { error: "Failed to get barcode data" },
      { status: 500 },
    );
  }
}
