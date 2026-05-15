import { cn, getChangeColor, getChangeIcon } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  highlight?: boolean;
  status?: "good" | "bad" | "neutral";
}

export function MetricCard({ label, value, change, changeLabel, icon: Icon, highlight, status }: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-900 rounded-2xl border p-5 transition-shadow hover:shadow-sm",
        highlight
          ? "border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950 dark:to-gray-900"
          : "border-gray-100 dark:border-gray-800"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        {Icon && (
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center",
            highlight ? "bg-orange-100 dark:bg-orange-900" : "bg-gray-100 dark:bg-gray-800"
          )}>
            <Icon className={cn("w-3.5 h-3.5", highlight ? "text-orange-500" : "text-gray-500 dark:text-gray-400")} />
          </div>
        )}
      </div>

      <p className={cn(
        "text-2xl font-semibold tracking-tight mb-1",
        status === "bad" ? "text-red-500" : status === "good" ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"
      )}>
        {value}
      </p>

      {change !== undefined && (
        <p className={cn("text-xs", getChangeColor(change))}>
          {getChangeIcon(change)} {Math.abs(change).toFixed(1)}%
          {changeLabel && <span className="text-gray-400 dark:text-gray-500"> {changeLabel}</span>}
        </p>
      )}
    </div>
  );
}
