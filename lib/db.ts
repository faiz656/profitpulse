// Database operations - all Supabase queries in one place
import { createSupabaseBrowserClient } from "./supabase";
import { ProductCostEntry, DarazOrder, AnalysisResult } from "../types";

// ─── PRODUCT COSTS ─────────────────────────────────────────

export async function saveProductCosts(entries: ProductCostEntry[]): Promise<void> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Not logged in — skip silently (demo mode)

    const rows = entries.map(e => ({
      user_id: user.id,
      product_name: e.product_name,
      selling_price: e.selling_price,
      cost_price: e.cost_price,
      category: e.category,
      commission_rate: e.commission_rate,
      updated_at: new Date().toISOString(),
    }));

    await supabase.from("product_costs").upsert(rows, { onConflict: "user_id,product_name" });
  } catch { /* fail silently */ }
}

export async function loadProductCosts(): Promise<ProductCostEntry[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("product_costs")
      .select("*")
      .eq("user_id", user.id);

    return (data || []).map(r => ({
      product_name: r.product_name,
      selling_price: r.selling_price,
      cost_price: r.cost_price,
      category: r.category,
      commission_rate: r.commission_rate,
    }));
  } catch { return []; }
}

// ─── UPLOADS ───────────────────────────────────────────────

export async function saveUpload(filename: string, rowCount: number): Promise<string | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase.from("uploads").insert({
      user_id: user.id,
      filename,
      row_count: rowCount,
      file_type: "orders",
      status: "complete",
    }).select("id").single();

    // Increment monthly upload count
    await supabase.rpc("increment_uploads", { uid: user.id });

    return data?.id ?? null;
  } catch { return null; }
}

export async function getUploadHistory() {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("uploads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    return data || [];
  } catch { return []; }
}

// ─── ANALYSIS CACHE ────────────────────────────────────────

export async function saveAnalysis(analysis: AnalysisResult, uploadId?: string): Promise<void> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("analysis_cache").insert({
      user_id: user.id,
      upload_id: uploadId || null,
      stats: analysis.stats,
      products: analysis.products,
      monthly_metrics: analysis.monthly_metrics,
      fee_breakdown: analysis.fee_breakdown,
      insights: analysis.insights,
    });
  } catch { /* fail silently */ }
}

export async function loadLatestAnalysis(): Promise<AnalysisResult | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("analysis_cache")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!data) return null;

    return {
      stats: data.stats,
      products: data.products,
      monthly_metrics: data.monthly_metrics,
      fee_breakdown: data.fee_breakdown,
      insights: data.insights,
      top_products: data.products.slice(0, 10),
      loss_makers: data.products.filter((p: { profit_margin: number }) => p.profit_margin < 5),
      upload_id: data.upload_id || "saved",
      analyzed_at: data.created_at,
    };
  } catch { return null; }
}

// ─── NOTIFICATIONS ─────────────────────────────────────────

export async function getNotifications() {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    return data || [];
  } catch { return []; }
}

export async function markNotificationRead(id: string) {
  try {
    const supabase = createSupabaseBrowserClient();
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  } catch { /* fail silently */ }
}

// ─── USER PROFILE ──────────────────────────────────────────

export async function getUserProfile() {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return data;
  } catch { return null; }
}

export async function updateUserProfile(updates: { full_name?: string; store_name?: string }) {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", user.id);
  } catch { /* fail silently */ }
}
