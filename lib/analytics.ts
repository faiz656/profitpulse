import { format, parseISO, startOfMonth } from "date-fns";
import {
  DarazOrder, Product, DashboardStats,
  MonthlyMetric, FeeBreakdown, AnalysisResult,
  AIInsight, ProductCostEntry,
} from "../types";

// Apply user-entered cost/category data to raw orders
export function applyProductCosts(
  orders: DarazOrder[],
  costEntries: ProductCostEntry[]
): DarazOrder[] {
  const costMap = new Map(costEntries.map((e) => [e.product_name, e]));

  return orders.map((order) => {
    const entry = costMap.get(order.product_name);
    if (!entry) return order;

    const price = order.selling_price;
    const commission = price * (entry.commission_rate / 100);
    const paymentFee = price * 0.0225;
    const handlingFee = 17;
    const taxWht = 30;

    return {
      ...order,
      daraz_commission: Math.round(commission),
      payment_fee: Math.round(paymentFee),
      handling_fee: handlingFee,
      tax_wht: taxWht,
      category: entry.category,
    };
  });
}

export function analyzeOrders(
  orders: DarazOrder[],
  costEntries?: ProductCostEntry[]
): Omit<AnalysisResult, "insights" | "upload_id" | "analyzed_at"> {
  const enriched = costEntries ? applyProductCosts(orders, costEntries) : orders;
  const completedOrders = enriched.filter((o) => o.status !== "cancelled");
  const returnedOrders = enriched.filter((o) => o.return_status === "returned");

  const totalRevenue = completedOrders.reduce((s, o) => s + o.selling_price * o.quantity, 0);
  const totalCommission = completedOrders.reduce((s, o) => s + o.daraz_commission, 0);
  const totalShipping = completedOrders.reduce((s, o) => s + o.shipping_fee, 0);
  const totalPaymentFees = completedOrders.reduce((s, o) => s + o.payment_fee, 0);
  const totalHandlingFees = completedOrders.reduce((s, o) => s + o.handling_fee, 0);
  const totalTaxWht = completedOrders.reduce((s, o) => s + o.tax_wht, 0);
  const totalAdSpend = completedOrders.reduce((s, o) => s + o.ad_cost, 0);
  const totalReturnLoss = returnedOrders.reduce((s, o) => s + o.selling_price * o.quantity, 0);

  // Cost of goods — only for orders where cost is known
  let totalCOGS = 0;
  if (costEntries) {
    const costMap = new Map(costEntries.map((e) => [e.product_name, e.cost_price]));
    totalCOGS = completedOrders.reduce((s, o) => {
      const cost = costMap.get(o.product_name) || 0;
      return s + cost * o.quantity;
    }, 0);
  }

  const totalFees = totalCommission + totalShipping + totalPaymentFees +
    totalHandlingFees + totalTaxWht + totalAdSpend + totalReturnLoss;

  const estimatedProfit = totalRevenue - totalFees - totalCOGS;
  const profitMargin = totalRevenue > 0 ? (estimatedProfit / totalRevenue) * 100 : 0;
  const returnRate = completedOrders.length > 0
    ? (returnedOrders.length / completedOrders.length) * 100 : 0;
  const roas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;

  const stats: DashboardStats = {
    total_revenue: totalRevenue,
    estimated_profit: estimatedProfit,
    profit_margin: profitMargin,
    total_orders: completedOrders.length,
    return_rate: returnRate,
    total_ad_spend: totalAdSpend,
    roas,
    total_commission: totalCommission,
    total_shipping_fees: totalShipping,
    total_handling_fees: totalHandlingFees,
    total_payment_fees: totalPaymentFees,
    total_tax_wht: totalTaxWht,
    total_cost_of_goods: totalCOGS,
    revenue_change: 0,
    profit_change: 0,
    orders_change: 0,
  };

  const feeBreakdown: FeeBreakdown = {
    commission: totalCommission,
    shipping: totalShipping,
    payment: totalPaymentFees,
    handling: totalHandlingFees,
    tax: totalTaxWht,
    returns_loss: totalReturnLoss,
    cost_of_goods: totalCOGS,
  };

  // Product analysis
  const productMap = new Map<string, Product>();
  const costMap = costEntries
    ? new Map(costEntries.map((e) => [e.product_name, e]))
    : new Map<string, ProductCostEntry>();

  for (const order of completedOrders) {
    const key = order.product_name;
    if (!productMap.has(key)) {
      const entry = costMap.get(key);
      productMap.set(key, {
        id: key.toLowerCase().replace(/\s+/g, "-").slice(0, 40),
        name: key,
        sku: order.sku,
        category: order.category || entry?.category,
        commission_rate: entry?.commission_rate || 10,
        cost_price: entry?.cost_price || 0,
        total_revenue: 0,
        total_orders: 0,
        total_quantity: 0,
        total_shipping_fee: 0,
        total_commission: 0,
        total_payment_fee: 0,
        total_handling_fee: 0,
        total_tax_wht: 0,
        total_ad_cost: 0,
        total_cost_of_goods: 0,
        total_returns: 0,
        return_rate: 0,
        estimated_profit: 0,
        profit_margin: 0,
        warnings: [],
        status: "healthy",
      });
    }

    const p = productMap.get(key)!;
    const revenue = order.selling_price * order.quantity;
    const cost = costMap.get(key)?.cost_price || 0;
    p.total_revenue += revenue;
    p.total_orders += 1;
    p.total_quantity += order.quantity;
    p.total_shipping_fee += order.shipping_fee;
    p.total_commission += order.daraz_commission;
    p.total_payment_fee += order.payment_fee;
    p.total_handling_fee += order.handling_fee;
    p.total_tax_wht += order.tax_wht;
    p.total_ad_cost += order.ad_cost;
    p.total_cost_of_goods += cost * order.quantity;
    if (order.return_status === "returned") p.total_returns += 1;
  }

  for (const product of Array.from(productMap.values())) {
    const returnLoss = (product.total_returns / Math.max(product.total_orders, 1)) * product.total_revenue;
    product.estimated_profit =
      product.total_revenue
      - product.total_commission
      - product.total_shipping_fee
      - product.total_payment_fee
      - product.total_handling_fee
      - product.total_tax_wht
      - product.total_ad_cost
      - product.total_cost_of_goods
      - returnLoss;
    product.profit_margin =
      product.total_revenue > 0
        ? (product.estimated_profit / product.total_revenue) * 100
        : 0;
    product.return_rate =
      product.total_orders > 0
        ? (product.total_returns / product.total_orders) * 100
        : 0;

    product.warnings = [];
    if (product.return_rate > 15) product.warnings.push("High return rate");
    if (product.profit_margin < 5 && product.profit_margin >= 0) product.warnings.push("Very thin margin");
    if (product.profit_margin < 0) product.warnings.push("Losing money on every sale");
    if (product.total_shipping_fee > product.total_revenue * 0.15) product.warnings.push("Shipping eating margin");

    product.status =
      product.profit_margin < 0 ? "critical"
      : product.warnings.length > 0 ? "warning"
      : "healthy";
  }

  const products = Array.from(productMap.values()).sort((a, b) => b.total_revenue - a.total_revenue);
  const topProducts = products.slice(0, 10);
  const lossMakers = products.filter((p) => p.profit_margin < 5).sort((a, b) => a.profit_margin - b.profit_margin);

  // Monthly metrics
  const monthlyMap = new Map<string, MonthlyMetric>();
  for (const order of completedOrders) {
    try {
      const month = format(startOfMonth(parseISO(order.order_date)), "MMM yyyy");
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { month, revenue: 0, profit: 0, orders: 0, returns: 0, ad_spend: 0 });
      }
      const m = monthlyMap.get(month)!;
      m.revenue += order.selling_price * order.quantity;
      m.orders += 1;
      m.ad_spend += order.ad_cost;
      if (order.return_status === "returned") m.returns += 1;
    } catch { /* skip bad dates */ }
  }

  for (const m of Array.from(monthlyMap.values())) {
    const monthOrders = completedOrders.filter((o) => {
      try {
        return format(startOfMonth(parseISO(o.order_date)), "MMM yyyy") === m.month;
      } catch { return false; }
    });
    const commission = monthOrders.reduce((s, o) => s + o.daraz_commission, 0);
    const shipping = monthOrders.reduce((s, o) => s + o.shipping_fee, 0);
    const payment = monthOrders.reduce((s, o) => s + o.payment_fee, 0);
    const handling = monthOrders.reduce((s, o) => s + o.handling_fee, 0);
    const tax = monthOrders.reduce((s, o) => s + o.tax_wht, 0);
    const cogs = monthOrders.reduce((s, o) => {
      const cost = costMap.get(o.product_name)?.cost_price || 0;
      return s + cost * o.quantity;
    }, 0);
    const returnLoss = monthOrders
      .filter((o) => o.return_status === "returned")
      .reduce((s, o) => s + o.selling_price, 0);
    m.profit = m.revenue - commission - shipping - payment - handling - tax - cogs - returnLoss;
  }

  const monthlyMetrics = Array.from(monthlyMap.values()).sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  return { stats, products, monthly_metrics: monthlyMetrics, fee_breakdown: feeBreakdown, top_products: topProducts, loss_makers: lossMakers };
}

export function formatCompact(amount: number): string {
  if (amount >= 100000) return `₨${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₨${(amount / 1000).toFixed(0)}K`;
  return `₨${Math.round(amount)}`;
}
