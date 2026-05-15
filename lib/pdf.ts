// PDF report generation
import { AnalysisResult } from "../types";
import { formatCompact } from "./utils";

export async function generatePDFReport(analysis: AnalysisResult, storeName: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const orange = [249, 115, 22] as [number, number, number];
  const dark = [17, 17, 17] as [number, number, number];
  const gray = [107, 114, 128] as [number, number, number];
  const green = [34, 197, 94] as [number, number, number];
  const red = [239, 68, 68] as [number, number, number];

  const W = 210;
  let y = 0;

  // Header
  doc.setFillColor(...orange);
  doc.rect(0, 0, W, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ProfitPulse", 15, 13);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Daraz Seller Analytics Report", 15, 20);
  doc.text(storeName, W - 15, 13, { align: "right" });
  doc.text(new Date().toLocaleDateString("en-PK"), W - 15, 20, { align: "right" });

  y = 38;

  // Summary title
  doc.setTextColor(...dark);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 15, y);
  y += 8;

  // KPI boxes
  const kpis = [
    { label: "Total Revenue", value: formatCompact(analysis.stats.total_revenue), color: orange },
    { label: "Real Profit", value: formatCompact(analysis.stats.estimated_profit), color: analysis.stats.estimated_profit >= 0 ? green : red },
    { label: "Profit Margin", value: `${analysis.stats.profit_margin.toFixed(1)}%`, color: orange },
    { label: "Return Rate", value: `${analysis.stats.return_rate.toFixed(1)}%`, color: analysis.stats.return_rate > 10 ? red : green },
    { label: "Total Orders", value: analysis.stats.total_orders.toString(), color: orange },
    { label: "Commission Paid", value: formatCompact(analysis.stats.total_commission), color: red },
  ];

  const boxW = 56;
  const boxH = 20;
  kpis.forEach((k, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 15 + col * (boxW + 6);
    const by = y + row * (boxH + 4);

    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(x, by, boxW, boxH, 2, 2, "FD");

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(k.label, x + 4, by + 6);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...k.color);
    doc.text(k.value, x + 4, by + 15);
  });

  y += 52;

  // Fee breakdown
  doc.setTextColor(...dark);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Fee Breakdown", 15, y);
  y += 8;

  const fees = [
    { name: "Commission", value: analysis.fee_breakdown.commission },
    { name: "Shipping", value: analysis.fee_breakdown.shipping },
    { name: "Payment Fee (2.25%)", value: analysis.fee_breakdown.payment },
    { name: "Handling + Tax WHT", value: analysis.fee_breakdown.handling + analysis.fee_breakdown.tax },
    { name: "Returns Loss", value: analysis.fee_breakdown.returns_loss },
    { name: "Cost of Goods", value: analysis.fee_breakdown.cost_of_goods },
  ].filter(f => f.value > 0);

  const totalFees = fees.reduce((s, f) => s + f.value, 0);
  fees.forEach(fee => {
    const pct = totalFees > 0 ? (fee.value / totalFees * 100) : 0;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(fee.name, 15, y + 3);
    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.text(formatCompact(fee.value), 120, y + 3);
    doc.text(`${pct.toFixed(0)}%`, 160, y + 3);

    // Bar
    doc.setFillColor(230, 230, 230);
    doc.rect(15, y + 5, 150, 2, "F");
    doc.setFillColor(...orange);
    doc.rect(15, y + 5, 150 * pct / 100, 2, "F");
    y += 12;
  });

  y += 6;

  // Top products table
  doc.setTextColor(...dark);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Top Products", 15, y);
  y += 8;

  // Table header
  doc.setFillColor(...orange);
  doc.rect(15, y, 180, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("Product", 17, y + 5);
  doc.text("Revenue", 115, y + 5);
  doc.text("Profit", 140, y + 5);
  doc.text("Margin", 163, y + 5);
  doc.text("Returns", 183, y + 5);
  y += 7;

  analysis.top_products.slice(0, 10).forEach((p, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(15, y, 180, 7, "F");
    }
    doc.setTextColor(...dark);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const name = p.name.length > 42 ? p.name.slice(0, 42) + "…" : p.name;
    doc.text(name, 17, y + 5);
    doc.text(formatCompact(p.total_revenue), 115, y + 5);
    const profitColor = p.estimated_profit >= 0 ? green : red;
    doc.setTextColor(...profitColor);
    doc.text(formatCompact(p.estimated_profit), 140, y + 5);
    if (p.profit_margin < 10) { doc.setTextColor(...red); } else { doc.setTextColor(...dark); }
    doc.text(`${p.profit_margin.toFixed(1)}%`, 163, y + 5);
    if (p.return_rate > 10) { doc.setTextColor(...red); } else { doc.setTextColor(...dark); }
    doc.text(`${p.return_rate.toFixed(1)}%`, 183, y + 5);
    y += 7;
  });

  // Footer
  doc.setFillColor(249, 115, 22);
  doc.rect(0, 280, W, 17, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Generated by ProfitPulse — profitpulse.pk", W / 2, 291, { align: "center" });

  doc.save(`ProfitPulse-Report-${new Date().toISOString().split("T")[0]}.pdf`);
}
