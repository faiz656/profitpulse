import { AnalysisResult } from "../types";

const KEY = "pp_v4";

export function saveAnalysisToStore(result: AnalysisResult, isDemo = false): void {
  try { localStorage.setItem(KEY, JSON.stringify({ result, isDemo })); } catch { /* ignore */ }
}

export function loadAnalysisFromStore(): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw).result as AnalysisResult;
  } catch { return null; }
}

export function isStoreDemo(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    return JSON.parse(raw).isDemo === true;
  } catch { return false; }
}

export function clearAnalysisStore(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
