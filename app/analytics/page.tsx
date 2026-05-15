"use client";
import { useState, useEffect } from "react";
import { analyzeOrders, formatCompact } from "../../lib/analytics";
import { generateDummyOrders } from "../../lib/csvParser";
import { loadAnalysisFromStore } from "../../lib/store";
import { RevenueChart } from "../../components/charts/RevenueChart";
import { Sidebar } from "../../components/layout/Sidebar";
import { BarChart3, TrendingUp, ShoppingBag } from "lucide-react";
import { AnalysisResult } from "../../types";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("6m");
  const [data, setData] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const saved = loadAnalysisFromStore();
    if (saved) {
      setData(saved);
    } else {
      // No data — show empty state, don't show dummy data
      setData(null);
    }
  }, []);

  if (!data) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl mb-3">📊</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No data yet</p>
            <p className="text-xs text-gray-400 mb-4">Upload your Daraz export from the dashboard first</p>
            <a href="/dashboard" className="text-xs bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Go to Dashboard →
            </a>
          </div>
        </main>
      </div>
    );
  }

  const filtered = period === "3m"
    ? data.monthly_metrics.slice(-3)
    : period === "1y"
    ? data.monthly_metrics
    : data.monthly_metrics.slice(-6);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 sticky top-0 z-10">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-xs text-gray-400">Sales and profit trends over time</p>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            {["3m", "6m", "1y"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${period === p ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300"}`}>
                {p === "3m" ? "3 months" : p === "6m" ? "6 months" : "1 year"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Revenue", value: formatCompact(filtered.reduce((s, m) => s + m.revenue, 0)), icon: TrendingUp, color: "text-orange-500" },
              { label: "Total Profit", value: formatCompact(filtered.reduce((s, m) => s + m.profit, 0)), icon: BarChart3, color: "text-green-500" },
              { label: "Total Orders", value: filtered.reduce((s, m) => s + m.orders, 0).toLocaleString(), icon: ShoppingBag, color: "text-blue-500" },
            ].map((c) => (
              <div key={c.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <c.icon className={`w-4 h-4 ${c.color}`} />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
                </div>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{c.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Revenue vs Profit Trend</h2>
            <p className="text-xs text-gray-400 mb-4">Monthly breakdown</p>
            <RevenueChart data={filtered} type="area" />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Breakdown</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {["Month", "Revenue", "Profit", "Orders", "Returns", "Ad Spend"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-gray-400 pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...filtered].reverse().map((m) => (
                  <tr key={m.month} className="border-b border-gray-50 dark:border-gray-800/50">
                    <td className="py-2.5 pr-4 text-xs font-medium text-gray-900 dark:text-white">{m.month}</td>
                    <td className="py-2.5 pr-4 text-xs text-gray-700 dark:text-gray-300">{formatCompact(m.revenue)}</td>
                    <td className={`py-2.5 pr-4 text-xs font-medium ${m.profit < 0 ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>{formatCompact(m.profit)}</td>
                    <td className="py-2.5 pr-4 text-xs text-gray-700 dark:text-gray-300">{m.orders}</td>
                    <td className={`py-2.5 pr-4 text-xs ${m.returns > 5 ? "text-amber-500" : "text-gray-500"}`}>{m.returns}</td>
                    <td className="py-2.5 text-xs text-gray-500 dark:text-gray-400">{formatCompact(m.ad_spend)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
