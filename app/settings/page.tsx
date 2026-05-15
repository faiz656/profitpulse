"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { toast } from "sonner";
import { Save, Trash2, Bell, Shield, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({ storeName: "", fullName: "", email: "", openaiKey: "" });
  const [notifications, setNotifications] = useState({ weekly: true, returnSpike: true, profitDrop: true, saleEvents: true });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    async function load() {
      try {
        const { createSupabaseBrowserClient } = await import("../../lib/supabase");
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setForm(f => ({
          ...f,
          email: user.email || "",
          fullName: user.user_metadata?.full_name || "",
          storeName: user.user_metadata?.store_name || "",
        }));

        // Also load from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setForm(f => ({
            ...f,
            fullName: profile.full_name || f.fullName,
            storeName: profile.store_name || f.storeName,
          }));
          setPlan(profile.plan || "free");
        }
      } catch (e) {
        console.error("Load error:", e);
      }
    }
    load();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { createSupabaseBrowserClient } = await import("../../lib/supabase");
      const supabase = createSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: form.fullName, store_name: form.storeName }
      });
      if (authError) throw authError;

      // Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: form.fullName,
          store_name: form.storeName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast.success("Settings saved!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-orange-500" />
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) => (
    <div className="mb-4 last:mb-0">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        value={form[name as keyof typeof form]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );

  const Toggle = ({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div>
        <p className="text-sm text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-400">{desc}</p>
      </div>
      <button
        onClick={onChange}
        className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${checked ? "bg-orange-500" : "bg-gray-200 dark:bg-gray-700"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 sticky top-0 z-10">
          <h1 className="text-base font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-xs text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="p-6 max-w-xl space-y-4">
          {/* Plan badge */}
          <div className={`rounded-xl p-4 flex items-center justify-between ${plan === "pro" ? "bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900" : "bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"}`}>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {plan === "pro" ? "Pro Plan" : "Free Plan"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {plan === "pro" ? "Unlimited uploads, AI insights, PDF reports" : "1 upload/month, 30 days history"}
              </p>
            </div>
            {plan !== "pro" && (
              <a href="/pricing" className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors font-medium shrink-0">
                Upgrade →
              </a>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Section title="Store Profile" icon={Shield}>
              <Field label="Full Name" name="fullName" placeholder="Ahmed Khan" />
              <Field label="Store Name" name="storeName" placeholder="Khan Electronics" />
              <div className="mb-0">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input
                  value={form.email}
                  disabled
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 text-sm cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
              </div>
            </Section>

            <Section title="AI Configuration" icon={CreditCard}>
              <div className="bg-orange-50 dark:bg-orange-950 border border-orange-100 dark:border-orange-900 rounded-xl p-3 mb-4">
                <p className="text-xs text-orange-700 dark:text-orange-400">
                  Add your OpenAI API key to unlock GPT-4 powered insights. Without it, smart rule-based insights are used.
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">OpenAI API Key</label>
                <input
                  name="openaiKey"
                  type="password"
                  value={form.openaiKey}
                  onChange={(e) => setForm(f => ({ ...f, openaiKey: e.target.value }))}
                  placeholder="sk-..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-[10px] text-gray-400 mt-1">Get your key at platform.openai.com</p>
              </div>
            </Section>

            <Section title="Notifications" icon={Bell}>
              <Toggle label="Weekly profit summary" desc="Email every Monday with last week's numbers" checked={notifications.weekly} onChange={() => setNotifications(n => ({ ...n, weekly: !n.weekly }))} />
              <Toggle label="Return rate spike" desc="Alert when any product exceeds 15% returns" checked={notifications.returnSpike} onChange={() => setNotifications(n => ({ ...n, returnSpike: !n.returnSpike }))} />
              <Toggle label="Profit drop alert" desc="Alert when monthly profit drops more than 20%" checked={notifications.profitDrop} onChange={() => setNotifications(n => ({ ...n, profitDrop: !n.profitDrop }))} />
              <Toggle label="Daraz sale events" desc="Reminders 2 weeks before 11.11, 12.12, Ramadan" checked={notifications.saleEvents} onChange={() => setNotifications(n => ({ ...n, saleEvents: !n.saleEvents }))} />
            </Section>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save settings"}
              </button>
            </div>
          </form>

          {/* Danger zone */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-100 dark:border-red-900 p-5">
            <h2 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">Danger zone</h2>
            <p className="text-xs text-gray-400 mb-3">Permanently delete your account and all data. This cannot be undone.</p>
            <button className="flex items-center gap-2 border border-red-200 dark:border-red-800 text-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
              Delete account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
