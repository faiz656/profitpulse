export interface DarazOrder {
  order_id: string;
  order_date: string;
  product_name: string;
  sku?: string;
  quantity: number;
  selling_price: number;
  shipping_fee: number;
  daraz_commission: number;
  payment_fee: number;
  handling_fee: number;
  tax_wht: number;
  return_status: "none" | "returned" | "partially_returned";
  ad_cost: number;
  category?: string;
  status: "completed" | "cancelled" | "pending";
}

export interface ProductCostEntry {
  product_name: string;
  selling_price: number;
  cost_price: number;
  category: string;
  commission_rate: number;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  commission_rate: number;
  cost_price: number;
  total_revenue: number;
  total_orders: number;
  total_quantity: number;
  total_shipping_fee: number;
  total_commission: number;
  total_payment_fee: number;
  total_handling_fee: number;
  total_tax_wht: number;
  total_ad_cost: number;
  total_cost_of_goods: number;
  total_returns: number;
  return_rate: number;
  estimated_profit: number;
  profit_margin: number;
  best_month?: string;
  warnings: string[];
  status: "healthy" | "warning" | "critical";
}

export interface MonthlyMetric {
  month: string;
  revenue: number;
  profit: number;
  orders: number;
  returns: number;
  ad_spend: number;
}

export interface DashboardStats {
  total_revenue: number;
  estimated_profit: number;
  profit_margin: number;
  total_orders: number;
  return_rate: number;
  total_ad_spend: number;
  roas: number;
  total_commission: number;
  total_shipping_fees: number;
  total_handling_fees: number;
  total_payment_fees: number;
  total_tax_wht: number;
  total_cost_of_goods: number;
  revenue_change: number;
  profit_change: number;
  orders_change: number;
}

export interface FeeBreakdown {
  commission: number;
  shipping: number;
  payment: number;
  handling: number;
  tax: number;
  returns_loss: number;
  cost_of_goods: number;
}

export interface AIInsight {
  id: string;
  type: "warning" | "opportunity" | "critical" | "info";
  title: string;
  description: string;
  product?: string;
  impact: "high" | "medium" | "low";
  action?: string;
}

export interface AnalysisResult {
  stats: DashboardStats;
  products: Product[];
  monthly_metrics: MonthlyMetric[];
  fee_breakdown: FeeBreakdown;
  insights: AIInsight[];
  top_products: Product[];
  loss_makers: Product[];
  upload_id: string;
  analyzed_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  store_name?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

// Daraz commission rates by category
export const DARAZ_CATEGORIES: { name: string; rate: number }[] = [
  { name: "Kitchen & Dining", rate: 13.3 },
  { name: "Bedding & Bath", rate: 13.3 },
  { name: "Home Decor", rate: 13.3 },
  { name: "Furniture", rate: 10.0 },
  { name: "Storage & Organisation", rate: 13.3 },
  { name: "Lighting", rate: 13.3 },
  { name: "Laundry & Cleaning", rate: 12.9 },
  { name: "Tools, DIY & Outdoor", rate: 12.9 },
  { name: "Health & Beauty", rate: 12.9 },
  { name: "Fashion", rate: 17.0 },
  { name: "Bags and Travel", rate: 15.0 },
  { name: "Watches Sunglasses Jewellery", rate: 18.0 },
  { name: "Kids' & Baby Fashion", rate: 2.65 },
  { name: "Mother & Baby", rate: 8.6 },
  { name: "Toys & Games", rate: 8.6 },
  { name: "Sports & Outdoors", rate: 8.6 },
  { name: "Mobiles & Tablets", rate: 12.9 },
  { name: "TV, Audio / Video, Gaming & Wearables", rate: 8.6 },
  { name: "Computers & Laptops", rate: 8.6 },
  { name: "Cameras", rate: 5.1 },
  { name: "Home Appliances", rate: 4.0 },
  { name: "Pet Supplies", rate: 8.5 },
  { name: "Groceries", rate: 3.4 },
  { name: "Stationery & Craft", rate: 4.3 },
  { name: "Media, Music & Books", rate: 13.3 },
  { name: "Motors", rate: 8.6 },
  { name: "Digital Goods", rate: 9.5 },
  { name: "Packaging Material", rate: 2.65 },
  { name: "Other", rate: 10.0 },
];
