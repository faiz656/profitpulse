"use client";
import { useState, useEffect } from "react";
import { loadAnalysisFromStore } from "../../lib/store";
import { ProductsTable } from "../../components/dashboard/ProductsTable";
import { Sidebar } from "../../components/layout/Sidebar";
import { Search, SlidersHorizontal } from "lucide-react";
import { Product } from "../../types";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadAnalysisFromStore();
    setProducts(saved?.products || []);
    setLoaded(true);
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter || (filter === "issues" && p.status !== "healthy");
    return matchSearch && matchFilter;
  });

  if (loaded && products.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl mb-3">📦</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No products yet</p>
            <p className="text-xs text-gray-400 mb-4">Upload your Daraz export from the dashboard first</p>
            <a href="/dashboard" className="text-xs bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">Go to Dashboard →</a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 sticky top-0 z-10 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900 dark:text-white">Products</h1>
            <p className="text-xs text-gray-400">{products.length} products analyzed</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
              {["all", "healthy", "warning", "critical", "issues"].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 text-xs rounded-md border capitalize transition-colors ${filter === f ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300"}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 dark:bg-green-950 rounded-xl border border-green-100 dark:border-green-900 p-3">
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">Healthy</p>
              <p className="text-xl font-semibold text-green-700 dark:text-green-300">{products.filter(p => p.status === "healthy").length}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950 rounded-xl border border-amber-100 dark:border-amber-900 p-3">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Warnings</p>
              <p className="text-xl font-semibold text-amber-700 dark:text-amber-300">{products.filter(p => p.status === "warning").length}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950 rounded-xl border border-red-100 dark:border-red-900 p-3">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">Critical</p>
              <p className="text-xl font-semibold text-red-700 dark:text-red-300">{products.filter(p => p.status === "critical").length}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <p className="text-xs text-gray-400 mb-4">{filtered.length} products</p>
            <ProductsTable products={filtered} />
          </div>
        </div>
      </main>
    </div>
  );
}
