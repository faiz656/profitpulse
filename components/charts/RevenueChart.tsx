"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from "recharts";
import { MonthlyMetric } from "../../types";
import { formatCompact } from "../../lib/analytics";

interface RevenueChartProps {
  data: MonthlyMetric[];
  type?: "area" | "bar";
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 shadow-lg text-xs">
        <p className="font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-500 dark:text-gray-400">{entry.name}:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatCompact(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data, type = "bar" }: RevenueChartProps) {
  const chartData = data.map((m) => ({
    month: m.month.split(" ")[0], // "Jan 2025" → "Jan"
    Revenue: m.revenue,
    Profit: m.profit,
  }));

  if (type === "area") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="Revenue" stroke="#f97316" fill="url(#revGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="Profit" stroke="#22c55e" fill="url(#profGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Bar dataKey="Profit" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface FeeDonutProps {
  data: { name: string; value: number; color: string }[];
}

export function FeeBreakdownChart({ data }: FeeDonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="space-y-2.5">
      {data.map((item) => (
        <div key={item.name}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
            </div>
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: total > 0 ? `${(item.value / total) * 100}%` : "0%", background: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
