"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { RevenueChart, FeeBreakdownChart } from "../../components/charts/RevenueChart";
import { InsightsPanel } from "../../components/dashboard/InsightsPanel";
import { ProductsTable } from "../../components/dashboard/ProductsTable";
import { CSVUploader } from "../../components/dashboard/CSVUploader";
import { ProductCostForm } from "../../components/dashboard/ProductCostForm";
import { DashboardSkeleton } from "../../components/dashboard/SkeletonLoader";
import { analyzeOrders, formatCompact } from "../../lib/analytics";
import { generateDummyOrders } from "../../lib/csvParser";
import { generateRuleBasedInsightsFallback } from "../../lib/aiInsights";
import { DollarSign, TrendingUp, RotateCcw, Receipt, Upload, Pencil, FileDown } from "lucide-react";
import Link from "next/link";
import { AnalysisResult, ProductCostEntry, DarazOrder } from "../../types";
import { toast } from "sonner";

const DEMO_COST_ENTRIES: ProductCostEntry[] = [
  { product_name: "Samsung A15 Back Cover", selling_price: 450, cost_price: 180, category: "Mobile Accessories", commission_rate: 12.9 },
  { product_name: "Xiaomi Earbuds Pro", selling_price: 2800, cost_price: 1200, category: "TV, Audio / Video, Gaming & Wearables", commission_rate: 8.6 },
  { product_name: "Cotton Kurta Set Men L", selling_price: 1800, cost_price: 700, category: "Fashion", commission_rate: 17 },
  { product_name: "USB-C Fast Charging Cable 1m", selling_price: 380, cost_price: 120, category: "Mobile Accessories", commission_rate: 12.9 },
  { product_name: "Nonstick Cooking Pan 24cm", selling_price: 1200, cost_price: 480, category: "Kitchen & Dining", commission_rate: 13.3 },
  { product_name: "Logitech Wireless Mouse M185", selling_price: 2200, cost_price: 950, category: "Computers & Laptops", commission_rate: 8.6 },
  { product_name: "Women Instant Hijab Black", selling_price: 650, cost_price: 220, category: "Fashion", commission_rate: 17 },
  { product_name: "Protein Shaker Bottle 700ml", selling_price: 750, cost_price: 280, category: "Sports & Outdoors", commission_rate: 8.6 },
  { product_name: "LED Desk Lamp Adjustable", selling_price: 1600, cost_price: 600, category: "Home Decor", commission_rate: 13.3 },
  { product_name: "Baby Wipes 80pcs Sensitive", selling_price: 520, cost_price: 200, category: "Mother & Baby", commission_rate: 8.6 },
];

type Screen = "upload" | "cost-entry" | "dashboard";

interface ParsedFile {
  orders: DarazOrder[];
  uniqueProducts: { name: string; selling_price: number }[];
  rowCount: number;
  fileName: string;
}

function buildResult(orders: DarazOrder[], entries: ProductCostEntry[], demo: boolean): AnalysisResult {
  const data = analyzeOrders(orders, entries);
  const insights = generateRuleBasedInsightsFallback(data.stats, data.products);
  return { ...data, insights, upload_id: demo ? "demo" : `u_${Date.now()}`, analyzed_at: new Date().toISOString() };
}

export default function DashboardPage() {
  const [screen, setScreen] = useState<Screen>("upload");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [entries, setEntries] = useState<ProductCostEntry[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [ready, setReady] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pp_v4");
      if (saved) {
        const parsed = JSON.parse(saved);
        setResult(parsed.result);
        setIsDemo(parsed.isDemo || false);
        setScreen("dashboard");
      }
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  function save(r: AnalysisResult, demo: boolean) {
    try { localStorage.setItem("pp_v4", JSON.stringify({ result: r, isDemo: demo })); } catch { /* ignore */ }
  }

  function loadDemo() {
    const orders = generateDummyOrders();
    const r = buildResult(orders, DEMO_COST_ENTRIES, true);
    setResult(r);
    setIsDemo(true);
    setParsedFile({ orders, uniqueProducts: [], rowCount: orders.length, fileName: "demo" });
    setEntries(DEMO_COST_ENTRIES);
    save(r, true);
    setScreen("dashboard");
  }

  function onFileParsed(file: ParsedFile) {
    setParsedFile(file);
    setScreen("cost-entry");
  }

  function onCostSubmit(e: ProductCostEntry[]) {
    setEntries(e);
    const r = buildResult(parsedFile!.orders, e, false);
    setResult(r);
    setIsDemo(false);
    save(r, false);
    setScreen("dashboard");
  }

  function clearAll() {
    try { localStorage.removeItem("pp_v4"); } catch { /* ignore */ }
    setResult(null);
    setParsedFile(null);
    setEntries([]);
    setIsDemo(false);
    setScreen("upload");
  }

  async function handleExportPDF() {
    if (!result) return;
    setPdfLoading(true);
    try {
      const { generatePDFReport } = await import("../../lib/pdf");
      const storeName = isDemo ? "Demo Store" : (parsedFile?.fileName?.replace(".xlsx", "") || "My Store");
      await generatePDFReport(result, storeName);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("PDF export failed — try again");
    } finally {
      setPdfLoading(false);
    }
  }

  if (!ready) return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <DashboardSkeleton />
      </main>
    </div>
  );

  // UPLOAD SCREEN
  if (screen === "upload") return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 md:pl-6 pl-14">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-xs text-gray-400">Upload your Daraz export to get started</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Know your real profits</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload your order export, enter cost prices, see exactly what you made after every Daraz fee.
              </p>
            </div>
            <CSVUploader onFileParsed={onFileParsed} onLoadDemo={loadDemo} />
          </div>
        </div>
      </main>
    </div>
  );

  // COST ENTRY SCREEN
  if (screen === "cost-entry" && parsedFile) return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <ProductCostForm
          uniqueProducts={parsedFile.uniqueProducts.length > 0 ? parsedFile.uniqueProducts : entries.map(e => ({ name: e.product_name, selling_price: e.selling_price }))}
          initialEntries={entries.length > 0 ? entries : undefined}
          onSubmit={onCostSubmit}
          onBack={() => setScreen(result ? "dashboard" : "upload")}
        />
      </main>
    </div>
  );

  // EMPTY STATE — uploaded but 0 delivered orders
  if (result && result.stats.total_orders === 0) return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <p className="text-4xl mb-4">📭</p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No delivered orders found</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your file was uploaded but it has no completed orders. Make sure you exported <strong>delivered</strong> orders from Daraz Seller Center, not pending or cancelled ones.
          </p>
          <button onClick={clearAll} className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
            Try again with different file
          </button>
        </div>
      </main>
    </div>
  );

  if (!result) return null;
  const { stats, monthly_metrics, fee_breakdown, insights, top_products } = result;

  const feeData = [
    { name: "Cost of Goods", value: fee_breakdown.cost_of_goods, color: "#6366f1" },
    { name: "Commission", value: fee_breakdown.commission, color: "#ef4444" },
    { name: "Shipping", value: fee_breakdown.shipping, color: "#f97316" },
    { name: "Payment Fee", value: fee_breakdown.payment, color: "#3b82f6" },
    { name: "Handling+Tax", value: fee_breakdown.handling + fee_breakdown.tax, color: "#8b5cf6" },
    { name: "Returns Loss", value: fee_breakdown.returns_loss, color: "#ec4899" },
  ].filter(f => f.value > 0);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10 md:pl-6 pl-14">
          <div>
            <h1 className="text-base font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-xs text-gray-400">
              {isDemo ? "Demo data — sample Pakistani seller store" : `${parsedFile?.fileName} · ${parsedFile?.rowCount?.toLocaleString()} orders`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExportPDF} disabled={pdfLoading}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-500 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              <FileDown className="w-3 h-3" />
              {pdfLoading ? "Generating..." : "Export PDF"}
            </button>
            {!isDemo && (
              <button onClick={() => setScreen("cost-entry")}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-500 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                <Pencil className="w-3 h-3" /> Edit costs
              </button>
            )}
            <button onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-500 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-colors">
              <Upload className="w-3 h-3" /> {isDemo ? "Upload real data" : "New upload"}
            </button>
          </div>
        </div>

        {isDemo && (
          <div className="mx-6 mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3">
            <span className="text-xs text-amber-700">📊 <strong>Demo data</strong> — 10 sample products across different categories.</span>
            <button onClick={clearAll} className="shrink-0 text-xs bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition-colors">
              Upload mine →
            </button>
          </div>
        )}

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="Total Revenue" value={formatCompact(stats.total_revenue)} icon={DollarSign} highlight />
            <MetricCard label="Real Profit" value={formatCompact(stats.estimated_profit)} icon={TrendingUp} status={stats.estimated_profit < 0 ? "bad" : "good"} />
            <MetricCard label="Profit Margin" value={`${stats.profit_margin.toFixed(1)}%`} icon={Receipt} status={stats.profit_margin < 10 ? "bad" : "neutral"} />
            <MetricCard label="Return Rate" value={`${stats.return_rate.toFixed(1)}%`} icon={RotateCcw} status={stats.return_rate > 10 ? "bad" : "neutral"} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Commission paid", value: fee_breakdown.commission, color: "text-red-500" },
              { label: "Shipping paid", value: fee_breakdown.shipping, color: "text-orange-500" },
              { label: "Payment fees", value: fee_breakdown.payment, color: "text-blue-500" },
              { label: "Returns loss", value: fee_breakdown.returns_loss, color: "text-pink-500" },
            ].map(f => (
              <div key={f.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3">
                <p className="text-[10px] text-gray-400 mb-1">{f.label}</p>
                <p className={`text-base font-semibold ${f.color}`}>{formatCompact(f.value)}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue vs Real Profit</h2>
                  <p className="text-xs text-gray-400">After all fees and cost of goods</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-orange-400 inline-block"></span>Revenue</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-green-400 inline-block"></span>Profit</span>
                </div>
              </div>
              <RevenueChart data={monthly_metrics} type="bar" />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Where your money goes</h2>
              <p className="text-xs text-gray-400 mb-4">Every rupee Daraz + costs take</p>
              <div className="text-center mb-4">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {formatCompact(feeData.reduce((s, f) => s + f.value, 0))}
                </p>
                <p className="text-xs text-gray-400">total deductions</p>
              </div>
              <FeeBreakdownChart data={feeData} />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">AI Insights</h2>
                <p className="text-xs text-gray-400">{insights.filter(i => i.type === "critical" || i.type === "warning").length} issues detected</p>
              </div>
              <Link href="/insights" className="text-xs text-orange-500 hover:text-orange-600">View all →</Link>
            </div>
            <InsightsPanel insights={insights} compact />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Product Performance</h2>
                <p className="text-xs text-gray-400">Real profit per product after all deductions</p>
              </div>
              <Link href="/products" className="text-xs text-orange-500 hover:text-orange-600">View all →</Link>
            </div>
            <ProductsTable products={top_products} limit={6} />
          </div>
        </div>
      </main>
    </div>
  );
}
