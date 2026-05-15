"use client";
import { useEffect, useState } from "react";
import { loadAnalysisFromStore } from "../../lib/store";
import { formatCompact } from "../../lib/analytics";
import { Sidebar } from "../../components/layout/Sidebar";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { Product, DashboardStats, FeeBreakdown } from "../../types";

export default function ReturnsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fees, setFees] = useState<FeeBreakdown | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadAnalysisFromStore();
    if (saved) {
      setProducts(saved.products);
      setStats(saved.stats);
      setFees(saved.fee_breakdown);
    }
    setLoaded(true);
  }, []);

  if (loaded && !stats) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl mb-3">🔄</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No data yet</p>
            <p className="text-xs text-gray-400 mb-4">Upload your Daraz export from the dashboard first</p>
            <a href="/dashboard" className="text-xs bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">Go to Dashboard →</a>
          </div>
        </main>
      </div>
    );
  }

  const highReturns = products.filter(p => p.return_rate > 5).sort((a, b) => b.return_rate - a.return_rate);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 sticky top-0 z-10">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">Return Analysis</h1>
          <p className="text-xs text-gray-400">Products with elevated return rates</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-2"><RotateCcw className="w-4 h-4 text-orange-500" /><p className="text-xs text-gray-500">Overall Return Rate</p></div>
              <p className={`text-2xl font-semibold ${stats && stats.return_rate > 10 ? "text-red-500" : "text-gray-900 dark:text-white"}`}>{stats?.return_rate.toFixed(1)}%</p>
              <p className="text-xs text-gray-400 mt-1">Industry avg: 5-7%</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <p className="text-xs text-gray-500 mb-2">Lost Revenue (Returns)</p>
              <p className="text-2xl font-semibold text-red-500">{fees ? formatCompact(fees.returns_loss) : "₨0"}</p>
              <p className="text-xs text-gray-400 mt-1">total returned amount</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <p className="text-xs text-gray-500 mb-2">Products with High Returns</p>
              <p className="text-2xl font-semibold text-amber-500">{highReturns.length}</p>
              <p className="text-xs text-gray-400 mt-1">above 5% return rate</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Products by Return Rate</h2>
            <div className="space-y-3">
              {highReturns.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {product.return_rate > 15 && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${product.return_rate > 15 ? "bg-red-400" : product.return_rate > 8 ? "bg-amber-400" : "bg-orange-300"}`}
                        style={{ width: `${Math.min(product.return_rate * 3, 100)}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${product.return_rate > 15 ? "text-red-500" : "text-amber-500"}`}>{product.return_rate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-400">{product.total_returns} returns</p>
                  </div>
                </div>
              ))}
              {highReturns.length === 0 && <p className="text-center text-sm text-gray-400 py-8">No products with elevated return rates 🎉</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
