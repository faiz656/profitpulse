import { AIInsight } from "../../types";
import { getInsightColor } from "../../lib/utils";
import { AlertTriangle, TrendingUp, Info, Zap } from "lucide-react";

const typeIcon = {
  critical: AlertTriangle,
  warning: AlertTriangle,
  opportunity: TrendingUp,
  info: Info,
};

const impactBadge = {
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

interface InsightsPanelProps {
  insights: AIInsight[];
  compact?: boolean;
}

export function InsightsPanel({ insights, compact = false }: InsightsPanelProps) {
  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Zap className="w-10 h-10 text-gray-200 dark:text-gray-700 mb-3" />
        <p className="text-sm text-gray-400">No insights yet — upload your CSV to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {insights.slice(0, compact ? 3 : undefined).map((insight) => {
        const colors = getInsightColor(insight.type);
        const Icon = typeIcon[insight.type] || Info;

        return (
          <div
            key={insight.id}
            className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${colors.badge}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className={`text-sm font-medium ${colors.text}`}>{insight.title}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${impactBadge[insight.impact]}`}>
                    {insight.impact} impact
                  </span>
                  {insight.product && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/20 text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                      {insight.product}
                    </span>
                  )}
                </div>
                <p className={`text-xs leading-relaxed ${colors.text} opacity-80`}>{insight.description}</p>
                {insight.action && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Action:</span>
                    <span className={`text-xs ${colors.text}`}>{insight.action}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
