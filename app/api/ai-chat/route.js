import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { message, reportContext } = await request.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }],
    });

    // We give Gemini the context of the daily report so it knows what you are talking about
    const prompt = `
      You are AlloyDash AI, an expert retail and inventory analyst for the AlloyDash diecast car store.
      Your primary focus is to help the admin with diecast car sales, trends, inventory, and retail business.
      You have access to real-time Google Search to find the latest diecast trends, popular models, and market data.
      If the admin asks about topics completely unrelated to diecast cars or retail, politely decline.
      Here is the admin's store report for context:
      "${reportContext}"
      The admin just asked:
      "${message}"
      Answer based on both the store context above AND your real-time search results when relevant. Do not use asterisks for formatting.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ success: true, reply: responseText });
  } catch (error) {
    console.error("Chat API Error: ", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
