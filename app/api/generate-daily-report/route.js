import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(request) {
  try {
    // Get Yesterday's Date boundaries
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    // Fetch Yesterday's Sales from POS Table
    const { data: salesData, error: salesError } = await supabase
      .from("POS")
      .select("quantity, Inventory(item_name, price, brand)")
      .gte("created_at", yesterday.toISOString())
      .lte("created_at", endOfYesterday.toISOString());

    if (salesError) throw salesError;

    //   Fetch current inventory to check what is running low
    const { data: inventoryData, error: invError } = await supabase
      .from("Inventory")
      .select("item_name, stock, brand")
      .order("stock", { ascending: true })
      .limit(10); // maybe change this to 6 lowest item stock later

    if (invError) throw invError;

    // Calculate total revenue and items sold
    let totalRevenue = 0;
    let totalItemsSold = 0;

    salesData.forEach((sale) => {
      const quantity = sale.quantity || 0;
      const price = sale.Inventory?.price || 0;
      totalItemsSold += quantity;
      totalRevenue += price * quantity;
    });

    // Build the prompt for Gemini
    const prompt = ` You are an expert retail analyst for AlloyDash, a store selling diecast cars.
      Here is the sales data for yesterday:
      - Total Revenue: ₱${totalRevenue}
      - Total Items Sold: ${totalItemsSold}
      
      Here are the items with the lowest stock right now:
      ${inventoryData.map((i) => `- ${i.item_name} (${i.brand}): ${i.stock} left`).join("\n")}
      
      Please write a short, professional, and insightful summary of yesterday's performance. 
      Identify any potential trends based on what is selling out, and suggest what the admin should restock.
     Keep the tone conversational and engaging, as this will be read aloud by a voice assistant named AlloyDash AI. Do not use asterisks or markdown formatting.
`;

    //   Call Gemini API
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    const result = await model.generateContent(prompt);
    const aiSummary = result.response.text();

    // Save report to DB
    const { error: insertError } = await supabase.from("daily_reports").insert({
      report_date: yesterday.toISOString().split("T")[0],
      summary: aiSummary,
    });

    // If there is an insert error, it might be because a report for this date already exists
    if (insertError) {
      console.log("Supabase Insert Warning: ", insertError.message);
    }

    return NextResponse.json({ success: true, report: aiSummary });
  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
