import Papa from "papaparse";
import { DarazOrder } from "../types";

function parseNumber(val: unknown): number {
  if (val === null || val === undefined || val === "") return 0;
  const cleaned = String(val).replace(/[^\d.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.abs(num);
}

function parseDate(val: unknown): string {
  if (!val) return new Date().toISOString().split("T")[0];
  const s = String(val);
  // Daraz format: "12 May 2026 22:36"
  const darazMatch = s.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (darazMatch) {
    const months: Record<string, string> = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    };
    const m = months[darazMatch[2]];
    if (m) return `${darazMatch[3]}-${m}-${darazMatch[1].padStart(2, "0")}`;
  }
  try {
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  } catch { /* ignore */ }
  return new Date().toISOString().split("T")[0];
}

function parseReturnStatus(status: string): DarazOrder["return_status"] {
  const s = status.toLowerCase();
  if (s === "returned" || s === "package returned" || s.includes("return")) return "returned";
  return "none";
}

function parseOrderStatus(status: string): DarazOrder["status"] {
  const s = status.toLowerCase();
  if (s === "canceled" || s === "cancelled") return "cancelled";
  if (s === "pending" || s === "shipped") return "pending";
  return "completed";
}

export interface ParseResult {
  orders: DarazOrder[];
  errors: string[];
  warnings: string[];
  rowCount: number;
  uniqueProducts: { name: string; selling_price: number; sku?: string }[];
}

function parseDarazRows(rows: Record<string, unknown>[]): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const orders: DarazOrder[] = [];
  const productMap = new Map<string, { name: string; selling_price: number; sku?: string }>();

  const firstRow = rows[0] || {};
  const isRealDarazFormat = "orderItemId" in firstRow || "paidPrice" in firstRow;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (isRealDarazFormat) {
      const status = String(row.status || "").trim();
      const paidPrice = parseNumber(row.paidPrice || row.unitPrice);
      if (paidPrice === 0) continue;

      const productName = String(row.itemName || "Unknown Product").slice(0, 100);

      // Track unique products with their selling price
      if (!productMap.has(productName)) {
        productMap.set(productName, {
          name: productName,
          selling_price: paidPrice,
          sku: String(row.sellerSku || ""),
        });
      }

      orders.push({
        order_id: String(row.orderItemId || row.orderNumber || `ROW-${i}`),
        order_date: parseDate(row.createTime),
        product_name: productName,
        sku: String(row.sellerSku || ""),
        quantity: 1,
        selling_price: paidPrice,
        shipping_fee: parseNumber(row.shippingFee),
        // These will be overridden after user enters cost/category
        daraz_commission: 0,
        payment_fee: 0,
        handling_fee: 0,
        tax_wht: 0,
        return_status: parseReturnStatus(status),
        ad_cost: 0,
        category: undefined,
        status: parseOrderStatus(status),
      });
    } else {
      // Generic CSV fallback
      const get = (keys: string[]): unknown => {
        for (const k of keys) {
          const found = Object.keys(row).find(
            (rk) => rk.toLowerCase().replace(/[\s_-]/g, "") === k.toLowerCase()
          );
          if (found && row[found] !== undefined && row[found] !== "") return row[found];
        }
        return undefined;
      };
      const paidPrice = parseNumber(get(["paidprice", "sellingprice", "price", "unitprice"]));
      if (paidPrice === 0) continue;
      const statusVal = String(get(["status", "orderstatus"]) || "completed");
      const productName = String(get(["itemname", "productname", "product"]) || "Unknown").slice(0, 100);

      if (!productMap.has(productName)) {
        productMap.set(productName, { name: productName, selling_price: paidPrice });
      }

      orders.push({
        order_id: String(get(["orderitemid", "orderid", "ordernumber"]) || `ROW-${i}`),
        order_date: parseDate(get(["createtime", "orderdate", "date"])),
        product_name: productName,
        quantity: parseNumber(get(["quantity", "qty"])) || 1,
        selling_price: paidPrice,
        shipping_fee: parseNumber(get(["shippingfee"])),
        daraz_commission: 0,
        payment_fee: 0,
        handling_fee: 0,
        tax_wht: 0,
        return_status: parseReturnStatus(statusVal),
        ad_cost: 0,
        status: parseOrderStatus(statusVal),
      });
    }
  }

  return {
    orders,
    errors,
    warnings,
    rowCount: orders.length,
    uniqueProducts: Array.from(productMap.values()),
  };
}

export function parseDarazCSV(csvText: string): ParseResult {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
  });
  if (!parsed.data || parsed.data.length === 0) {
    return { orders: [], errors: ["No data found"], warnings: [], rowCount: 0, uniqueProducts: [] };
  }
  return parseDarazRows(parsed.data as Record<string, unknown>[]);
}

export async function parseDarazXLSX(file: File): Promise<ParseResult> {
  try {
    const XLSX = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(buffer, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[];
    if (!rows || rows.length === 0) {
      return { orders: [], errors: ["No data found in Excel file"], warnings: [], rowCount: 0, uniqueProducts: [] };
    }
    return parseDarazRows(rows);
  } catch (err) {
    return {
      orders: [],
      errors: [`Failed to parse file: ${err instanceof Error ? err.message : "Unknown error"}`],
      warnings: [],
      rowCount: 0,
      uniqueProducts: [],
    };
  }
}

// Simple seeded random to avoid hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateDummyOrders(): import("../types").DarazOrder[] {
  const products = [
    { name: "Samsung A15 Back Cover", price: 450, cost: 180, cat: "Mobile Accessories", rate: 0.129 },
    { name: "Xiaomi Earbuds Pro", price: 2800, cost: 1200, cat: "TV, Audio / Video, Gaming & Wearables", rate: 0.086 },
    { name: "Cotton Kurta Set Men L", price: 1800, cost: 700, cat: "Fashion", rate: 0.17 },
    { name: "USB-C Fast Charging Cable 1m", price: 380, cost: 120, cat: "Mobile Accessories", rate: 0.129 },
    { name: "Nonstick Cooking Pan 24cm", price: 1200, cost: 480, cat: "Kitchen & Dining", rate: 0.133 },
    { name: "Logitech Wireless Mouse M185", price: 2200, cost: 950, cat: "Computers & Laptops", rate: 0.086 },
    { name: "Women Instant Hijab Black", price: 650, cost: 220, cat: "Fashion", rate: 0.17 },
    { name: "Protein Shaker Bottle 700ml", price: 750, cost: 280, cat: "Sports & Outdoors", rate: 0.086 },
    { name: "LED Desk Lamp Adjustable", price: 1600, cost: 600, cat: "Home Decor", rate: 0.133 },
    { name: "Baby Wipes 80pcs Sensitive", price: 520, cost: 200, cat: "Mother & Baby", rate: 0.086 },
    { name: "HP Laptop Sleeve 15 inch", price: 950, cost: 350, cat: "Computers & Laptops", rate: 0.086 },
    { name: "Face Wash Neutrogena 100ml", price: 880, cost: 420, cat: "Health & Beauty", rate: 0.129 },
    { name: "Kids Coloring Book Set", price: 420, cost: 150, cat: "Toys & Games", rate: 0.086 },
    { name: "Stainless Steel Water Bottle", price: 680, cost: 260, cat: "Sports & Outdoors", rate: 0.086 },
    { name: "Ceramic Coffee Mug 350ml", price: 550, cost: 200, cat: "Kitchen & Dining", rate: 0.133 },
  ];

  const orders: DarazOrder[] = [];
  const now = new Date();
  let seed = 42;

  for (let day = 180; day >= 0; day--) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);
    const dateStr = date.toISOString().split("T")[0];
    const ordersToday = Math.floor(Math.random() * 5) + 1;

    for (let o = 0; o < ordersToday; o++) {
      seed++;
      const prod = products[Math.floor(seededRandom(seed) * products.length)];
      const price = prod.price;
      const commission = price * prod.rate;
      const paymentFee = price * 0.0225;
      const handlingFee = 17;
      const taxWht = 30;
      const shipping = Math.random() > 0.4 ? 0 : 120;
      const returned = Math.random() < 0.09;

      orders.push({
        order_id: `DRZ-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        order_date: dateStr,
        product_name: prod.name,
        quantity: 1,
        selling_price: price,
        shipping_fee: shipping,
        daraz_commission: Math.round(commission),
        payment_fee: Math.round(paymentFee),
        handling_fee: handlingFee,
        tax_wht: taxWht,
        return_status: returned ? "returned" : "none",
        ad_cost: 0,
        category: prod.cat,
        status: "completed",
      });
    }
  }
  return orders;
}
