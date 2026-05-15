"use client";
import { useState } from "react";
import { ProductCostEntry, DARAZ_CATEGORIES } from "../../types";
import { cn } from "../../lib/utils";
import { ChevronDown, AlertCircle, CheckCircle2 } from "lucide-react";

interface ProductCostFormProps {
  uniqueProducts: { name: string; selling_price: number; sku?: string }[];
  initialEntries?: ProductCostEntry[];
  onSubmit: (entries: ProductCostEntry[]) => void;
  onBack: () => void;
}

export function ProductCostForm({ uniqueProducts, initialEntries, onSubmit, onBack }: ProductCostFormProps) {
  const [entries, setEntries] = useState<ProductCostEntry[]>(() => {
    if (initialEntries && initialEntries.length > 0) return initialEntries;
    return uniqueProducts.map((p) => ({
      product_name: p.name,
      selling_price: p.selling_price,
      cost_price: 0,
      category: "Kitchen & Dining",
      commission_rate: 13.3,
    }));
  });
  const [errors, setErrors] = useState<number[]>([]);

  function updateEntry(index: number, field: keyof ProductCostEntry, value: string | number) {
    setEntries((prev) => {
      const next = [...prev];
      if (field === "category") {
        const cat = DARAZ_CATEGORIES.find((c) => c.name === value);
        next[index] = {
          ...next[index],
          category: String(value),
          commission_rate: cat?.rate ?? 10,
        };
      } else {
        next[index] = { ...next[index], [field]: value };
      }
      return next;
    });
    setErrors((prev) => prev.filter((e) => e !== index));
  }

  function handleSubmit() {
    const invalid = entries
      .map((e, i) => (e.cost_price <= 0 ? i : -1))
      .filter((i) => i !== -1);
    if (invalid.length > 0) {
      setErrors(invalid);
      return;
    }
    onSubmit(entries);
  }

  const allFilled = entries.every((e) => e.cost_price > 0);

  return (
    <div className="animate-fade-in">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">Enter Product Details</h1>
          <p className="text-xs text-gray-400">
            {uniqueProducts.length} unique products found — enter cost price and category for each
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          ← Upload different file
        </button>
      </div>

      <div className="p-6">
        {/* Info banner */}
        <div className="bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 rounded-xl p-4 mb-6 flex gap-3">
          <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">
              This is how real profit gets calculated
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-500">
              Profit = Selling Price − Cost Price − Commission ({`category %`}) − Payment Fee (2.25%) − Handling (₨17) − Tax WHT (₨30) − Shipping
            </p>
          </div>
        </div>

        {/* Product rows */}
        <div className="space-y-3 mb-6">
          {entries.map((entry, i) => (
            <div
              key={i}
              className={cn(
                "bg-white dark:bg-gray-900 rounded-2xl border p-4 transition-colors",
                errors.includes(i)
                  ? "border-red-300 dark:border-red-800"
                  : "border-gray-100 dark:border-gray-800"
              )}
            >
              {/* Product name */}
              <p className="text-xs font-medium text-gray-900 dark:text-white mb-3 leading-relaxed">
                {entry.product_name}
              </p>

              <div className="grid grid-cols-3 gap-3">
                {/* Selling price (readonly) */}
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">Selling Price</label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-500 dark:text-gray-400 font-medium">
                    ₨{entry.selling_price.toLocaleString()}
                  </div>
                </div>

                {/* Cost price */}
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">
                    Your Cost Price <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">₨</span>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={entry.cost_price || ""}
                      onChange={(e) => updateEntry(i, "cost_price", parseFloat(e.target.value) || 0)}
                      className={cn(
                        "w-full pl-7 pr-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                        errors.includes(i)
                          ? "border-red-300 dark:border-red-700"
                          : "border-gray-200 dark:border-gray-700"
                      )}
                    />
                  </div>
                  {errors.includes(i) && (
                    <p className="text-[10px] text-red-500 mt-1">Required</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] text-gray-400 mb-1">
                    Category <span className="text-gray-300 dark:text-gray-600">({entry.commission_rate}% commission)</span>
                  </label>
                  <div className="relative">
                    <select
                      value={entry.category}
                      onChange={(e) => updateEntry(i, "category", e.target.value)}
                      className="w-full pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                    >
                      {DARAZ_CATEGORIES.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name} ({cat.rate}%)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Live profit preview */}
              {entry.cost_price > 0 && (() => {
                const commission = entry.selling_price * (entry.commission_rate / 100);
                const paymentFee = entry.selling_price * 0.0225;
                const handling = 17;
                const tax = 30;
                const totalFees = commission + paymentFee + handling + tax;
                const profit = entry.selling_price - entry.cost_price - totalFees;
                const margin = ((profit / entry.selling_price) * 100).toFixed(1);
                const isGood = profit > 0;
                return (
                  <div className={cn(
                    "mt-3 pt-3 border-t flex items-center justify-between",
                    "border-gray-100 dark:border-gray-800"
                  )}>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>Commission: ₨{Math.round(commission)}</span>
                      <span>•</span>
                      <span>Payment: ₨{Math.round(paymentFee)}</span>
                      <span>•</span>
                      <span>Handling+Tax: ₨{handling + tax}</span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1.5 text-xs font-semibold",
                      isGood ? "text-green-600 dark:text-green-400" : "text-red-500"
                    )}>
                      {isGood
                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : <AlertCircle className="w-3.5 h-3.5" />}
                      Profit per order: ₨{Math.round(profit)} ({margin}%)
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between sticky bottom-4">
          <p className="text-xs text-gray-400">
            {allFilled
              ? "✓ All products filled — ready to analyze"
              : `${entries.filter((e) => e.cost_price > 0).length}/${entries.length} products filled`}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!allFilled}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-medium transition-all",
              allFilled
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200 dark:shadow-orange-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
            )}
          >
            Analyze {entries.length} products →
          </button>
        </div>
      </div>
    </div>
  );
}
