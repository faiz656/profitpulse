import { NextRequest, NextResponse } from "next/server";
import { DashboardStats, Product } from "../../../types";
import { generateRuleBasedInsightsFallback } from "../../../lib/aiInsights";

export async function POST(req: NextRequest) {
  try {
    const { stats, products }: { stats: DashboardStats; products: Product[] } = await req.json();

    if (!stats || !products) {
      return NextResponse.json({ error: "Missing stats or products" }, { status: 400 });
    }

    // Try OpenAI if key exists, otherwise use rule-based
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== "your_openai_api_key_here") {
      try {
        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({ apiKey });

        const prompt = `You are a business analyst for a Pakistani Daraz seller. Return exactly 5 insights as a JSON array. Each: {"id":"string","type":"warning"|"opportunity"|"critical"|"info","title":"max 8 words","description":"2-3 sentences","product":null,"impact":"high"|"medium"|"low","action":"one action"}

Stats: Revenue ₨${Math.round(stats.total_revenue)}, Profit ₨${Math.round(stats.estimated_profit)}, Margin ${stats.profit_margin.toFixed(1)}%, Returns ${stats.return_rate.toFixed(1)}%, ROAS ${stats.roas.toFixed(2)}x

Return ONLY the JSON array, no markdown.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || "[]";
        const insights = JSON.parse(content.replace(/```json|```/g, "").trim());
        return NextResponse.json({ insights });
      } catch (e) {
        console.error("OpenAI failed, using fallback:", e);
      }
    }

    // Rule-based fallback
    const insights = generateRuleBasedInsightsFallback(stats, products);
    return NextResponse.json({ insights });

  } catch (error) {
    console.error("Insights API error:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
