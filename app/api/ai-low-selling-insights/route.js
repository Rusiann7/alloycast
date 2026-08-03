import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { lowProducts } = body;

    if (!lowProducts || !Array.isArray(lowProducts) || lowProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: "No low selling products provided." },
        { status: 400 },
      );
    }

    const productListFormatted = lowProducts
      .map((p) => `- ${p.name || p.item_name}: ${p.units ?? p.orders ?? 0} order(s)`)
      .join("\n");

    const prompt = `You are an expert e-commerce and retail marketing strategist for AlloyCast, a store specializing in collectible diecast model cars and diecast items.

Here is the list of current low-selling products in our store:
${productListFormatted}

Please provide a structured, highly actionable, and professional sales optimization guide to help the store Admin boost sales for these specific low-selling products and turn them into top sellers.

Structure your response clearly into 4 key strategic areas:
1. 🏷️ Promotional & Discount Strategies (e.g., targeted discounts, flash sales, tier bundles)
2. 📦 Product Bundling & Cross-Selling Ideas (pairing low-sellers with popular items)
3. 🎯 Marketing & Merchandising Placement (home page highlights, social media showcases, collector positioning)
4. 💡 Customer Engagement & Loyalty Incentives (bonus points, limited-time perks, target collector segment recommendations)

Keep the formatting clean, professional, and readable (use bullet points and clear headers, avoid clutter).`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);
    const insights = result.response.text();

    return NextResponse.json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error("Gemini AI Low Selling Insights Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate AI insights." },
      { status: 500 },
    );
  }
}
