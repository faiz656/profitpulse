import { AIInsight, Product, DashboardStats } from "../types";

function buildInsightsPrompt(stats: DashboardStats, products: Product[]): string {
  const topIssues = products
    .filter((p) => p.warnings.length > 0)
    .slice(0, 5)
    .map((p) => `- ${p.name}: margin ${p.profit_margin.toFixed(1)}%, return rate ${p.return_rate.toFixed(1)}%, warnings: ${p.warnings.join(", ")}`)
    .join("\n");

  return `You are a business analyst for a Pakistani Daraz seller. Analyze this data and return exactly 5 actionable insights in JSON.

STORE METRICS:
- Total Revenue: ₨${Math.round(stats.total_revenue).toLocaleString()}
- Estimated Profit: ₨${Math.round(stats.estimated_profit).toLocaleString()}
- Profit Margin: ${stats.profit_margin.toFixed(1)}%
- Return Rate: ${stats.return_rate.toFixed(1)}%
- ROAS: ${stats.roas.toFixed(2)}x
- Total Commission Paid: ₨${Math.round(stats.total_commission).toLocaleString()}
- Total Shipping Paid: ₨${Math.round(stats.total_shipping_fees).toLocaleString()}
- Total Ad Spend: ₨${Math.round(stats.total_ad_spend).toLocaleString()}

PRODUCT ISSUES:
${topIssues || "No major issues detected"}

Return ONLY a JSON array with exactly 5 items. Each item:
{
  "id": "unique-id",
  "type": "warning" | "opportunity" | "critical" | "info",
  "title": "Short title (max 8 words)",
  "description": "Specific actionable advice (2-3 sentences)",
  "product": "product name or null",
  "impact": "high" | "medium" | "low",
  "action": "One specific action to take"
}`;
}

export async function generateAIInsights(
  stats: DashboardStats,
  products: Product[]
): Promise<AIInsight[]> {
  try {
    const response = await fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stats, products }),
    });
    const { insights } = await response.json();
    return insights;
  } catch {
    return generateRuleBasedInsightsFallback(stats, products);
  }
}

export function generateRuleBasedInsightsFallback(stats: DashboardStats, products: Product[]): AIInsight[] {
  const insights: AIInsight[] = [];

  if (stats.return_rate > 10) {
    insights.push({
      id: "high-returns",
      type: "critical",
      title: "Return rate is above healthy threshold",
      description: `Your return rate of ${stats.return_rate.toFixed(1)}% is significantly above the Daraz average of 5-7%. This is costing you approximately ₨${Math.round(stats.total_revenue * (stats.return_rate / 100)).toLocaleString()} in lost revenue. Review product descriptions and images for accuracy.`,
      impact: "high",
      action: "Add detailed size charts, real photos, and accurate descriptions to top-returned products",
    });
  }

  if (stats.roas < 2) {
    insights.push({
      id: "low-roas",
      type: "warning",
      title: "Ad spend efficiency is low",
      description: `Your ROAS of ${stats.roas.toFixed(2)}x means you earn ₨${stats.roas.toFixed(2)} for every ₨1 spent on ads. A healthy ROAS for Daraz is 3-5x. You're spending ₨${Math.round(stats.total_ad_spend).toLocaleString()} on ads — consider pausing low-performing campaigns.`,
      impact: "high",
      action: "Pause ads on products with less than 3x ROAS and reallocate budget to top performers",
    });
  }

  const highShippingProducts = products.filter(
    (p) => p.total_shipping_fee > p.total_revenue * 0.15 && p.total_revenue > 10000
  );
  if (highShippingProducts.length > 0) {
    insights.push({
      id: "shipping-drain",
      type: "warning",
      title: "Shipping costs reducing margins significantly",
      description: `${highShippingProducts.length} product(s) including "${highShippingProducts[0].name}" have shipping costs exceeding 15% of revenue. For low-priced items, offering bundle deals or setting a minimum order for free shipping can reduce per-unit shipping costs.`,
      product: highShippingProducts[0].name,
      impact: "medium",
      action: "Set minimum order value of ₨1,000 to qualify for free shipping promotions",
    });
  }

  const lossMakers = products.filter((p) => p.profit_margin < 0 && p.total_orders > 5);
  if (lossMakers.length > 0) {
    insights.push({
      id: "loss-products",
      type: "critical",
      title: `${lossMakers.length} product(s) losing money`,
      description: `"${lossMakers[0].name}" has a profit margin of ${lossMakers[0].profit_margin.toFixed(1)}%, meaning you lose money on every sale. Either reprice, reduce costs, or consider removing them.`,
      product: lossMakers[0].name,
      impact: "high",
      action: "Increase prices by 15-20% or negotiate better supplier terms for loss-making products",
    });
  }

  if (stats.profit_margin < 15) {
    insights.push({
      id: "margin-opportunity",
      type: "opportunity",
      title: "Bundle products to increase average order value",
      description: `Your current profit margin of ${stats.profit_margin.toFixed(1)}% can be improved by selling complementary products together. Bundles reduce per-unit commission rates and shipping costs, increasing overall profitability.`,
      impact: "medium",
      action: "Create 3 product bundles from your top sellers and test at a 5-10% bundle discount",
    });
  }

  while (insights.length < 5) {
    insights.push({
      id: `info-${insights.length}`,
      type: "info",
      title: "Optimize peak sales periods",
      description: "Daraz 11.11, 12.12, and Ramadan sales are the highest-converting periods. Build up inventory 3-4 weeks early and increase ad spend during these events to maximize revenue.",
      impact: "medium",
      action: "Set calendar reminders for Daraz sale events and prepare inventory 30 days in advance",
    });
  }

  return insights.slice(0, 5);
}
