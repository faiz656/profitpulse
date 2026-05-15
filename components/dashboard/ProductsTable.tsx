import { Product } from "../../types";
import { formatCompact, getStatusColor, cn } from "../../lib/utils";
import { AlertTriangle } from "lucide-react";

interface ProductsTableProps {
  products: Product[];
  limit?: number;
}

export function ProductsTable({ products, limit }: ProductsTableProps) {
  const displayed = limit ? products.slice(0, limit) : products;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="text-left text-xs font-medium text-gray-400 dark:text-gray-500 pb-3 pr-4">Product</th>
            <th className="text-right text-xs font-medium text-gray-400 dark:text-gray-500 pb-3 px-4">Revenue</th>
            <th className="text-right text-xs font-medium text-gray-400 dark:text-gray-500 pb-3 px-4">Profit</th>
            <th className="text-right text-xs font-medium text-gray-400 dark:text-gray-500 pb-3 px-4">Margin</th>
            <th className="text-right text-xs font-medium text-gray-400 dark:text-gray-500 pb-3 px-4">Returns</th>
            <th className="text-right text-xs font-medium text-gray-400 dark:text-gray-500 pb-3 pl-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {displayed.map((product, i) => (
            <tr
              key={product.id}
              className={cn(
                "border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors",
                i === displayed.length - 1 && "border-0"
              )}
            >
              <td className="py-3 pr-4">
                <div className="flex items-start gap-2">
                  {product.warnings.length > 0 && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-xs leading-tight">{product.name}</p>
                    {product.category && (
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{product.category}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <span className="text-xs font-medium text-gray-900 dark:text-white">{formatCompact(product.total_revenue)}</span>
                <p className="text-[10px] text-gray-400">{product.total_orders} orders</p>
              </td>
              <td className="py-3 px-4 text-right">
                <span className={cn(
                  "text-xs font-medium",
                  product.estimated_profit < 0 ? "text-red-500" : "text-gray-900 dark:text-white"
                )}>
                  {formatCompact(product.estimated_profit)}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div>
                  <span className={cn(
                    "text-xs font-medium",
                    product.profit_margin < 0 ? "text-red-500" : product.profit_margin < 10 ? "text-amber-500" : "text-green-600 dark:text-green-400"
                  )}>
                    {product.profit_margin.toFixed(1)}%
                  </span>
                  <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 w-16 ml-auto overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        product.profit_margin < 0 ? "bg-red-400" : product.profit_margin < 10 ? "bg-amber-400" : "bg-green-400"
                      )}
                      style={{ width: `${Math.min(Math.max(product.profit_margin, 0), 50) * 2}%` }}
                    />
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <span className={cn(
                  "text-xs",
                  product.return_rate > 15 ? "text-red-500 font-medium" : product.return_rate > 8 ? "text-amber-500" : "text-gray-500 dark:text-gray-400"
                )}>
                  {product.return_rate.toFixed(1)}%
                </span>
              </td>
              <td className="py-3 pl-4 text-right">
                <span className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                  getStatusColor(product.status)
                )}>
                  {product.status === "healthy" ? "Healthy" : product.status === "warning" ? "Warning" : "Critical"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
