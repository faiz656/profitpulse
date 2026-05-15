"use client";
import { useEffect, useState } from "react";
import { loadAnalysisFromStore } from "../../lib/store";
import { InsightsPanel } from "../../components/dashboard/InsightsPanel";
import { Sidebar } from "../../components/layout/Sidebar";
import { Sparkles } from "lucide-react";
import { AIInsight } from "../../types";

export default function InsightsPage() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadAnalysisFromStore();
    setInsights(saved?.insights || []);
    setLoaded(true);
  }, []);

  if (loaded && insights.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl mb-3">✨</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">No insights yet</p>
            <p className="text-xs text-gray-400 mb-4">Upload your Daraz export from the dashboard first</p>
            <a href="/dashboard" className="text-xs bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">Go to Dashboard →</a>
          </div>
        </main>
      </div>
    );
  }

  const critical = insights.filter(i => i.type === "critical");
  const warnings = insights.filter(i => i.type === "warning");
  const opportunities = insights.filter(i => i.type === "opportunity");
  const info = insights.filter(i => i.type === "info");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <h1 className="text-base font-semibold text-gray-900 dark:text-white">AI Insights</h1>
          </div>
          <p className="text-xs text-gray-400">Based on your uploaded order data</p>
        </div>
        <div className="p-6 space-y-6">
          {critical.length > 0 && <div><h2 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">🚨 Critical Issues ({critical.length})</h2><InsightsPanel insights={critical} /></div>}
          {warnings.length > 0 && <div><h2 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">⚠️ Warnings ({warnings.length})</h2><InsightsPanel insights={warnings} /></div>}
          {opportunities.length > 0 && <div><h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3">💡 Opportunities ({opportunities.length})</h2><InsightsPanel insights={opportunities} /></div>}
          {info.length > 0 && <div><h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">ℹ️ Tips ({info.length})</h2><InsightsPanel insights={info} /></div>}
        </div>
      </main>
    </div>
  );
}
