import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₨${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₨${(amount / 1000).toFixed(1)}K`;
  return `₨${Math.round(amount)}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function getChangeColor(change: number): string {
  if (change > 0) return "text-green-600 dark:text-green-400";
  if (change < 0) return "text-red-500 dark:text-red-400";
  return "text-gray-500";
}

export function getChangeIcon(change: number): string {
  if (change > 0) return "↑";
  if (change < 0) return "↓";
  return "→";
}

export function getStatusColor(status: "healthy" | "warning" | "critical") {
  switch (status) {
    case "healthy":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400";
    case "warning":
      return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400";
    case "critical":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400";
  }
}

export function getInsightColor(type: string) {
  switch (type) {
    case "critical":
      return { bg: "bg-red-50 dark:bg-red-950", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-400", badge: "bg-red-100 text-red-700" };
    case "warning":
      return { bg: "bg-orange-50 dark:bg-orange-950", border: "border-orange-200 dark:border-orange-800", text: "text-orange-700 dark:text-orange-400", badge: "bg-orange-100 text-orange-700" };
    case "opportunity":
      return { bg: "bg-blue-50 dark:bg-blue-950", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-400", badge: "bg-blue-100 text-blue-700" };
    default:
      return { bg: "bg-gray-50 dark:bg-gray-900", border: "border-gray-200 dark:border-gray-700", text: "text-gray-700 dark:text-gray-300", badge: "bg-gray-100 text-gray-700" };
  }
}

export function formatCompact(amount: number): string {
  if (amount >= 100000) return `₨${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₨${(amount / 1000).toFixed(0)}K`;
  return `₨${Math.round(amount)}`;
}
