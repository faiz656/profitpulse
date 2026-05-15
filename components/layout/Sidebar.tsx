"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard, BarChart3, Package, RefreshCw,
  Sparkles, Settings, LogOut, TrendingUp, Bell, X, Menu,
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/products", label: "Products", icon: Package },
  { href: "/returns", label: "Returns", icon: RefreshCw },
  { href: "/insights", label: "AI Insights", icon: Sparkles },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "warning" | "info" | "critical";
  time: string;
  read: boolean;
}

function generateNotifications(analysisKey = "pp_v4"): Notification[] {
  try {
    const raw = localStorage.getItem(analysisKey);
    if (!raw) return getDefaultNotifications();
    const { result } = JSON.parse(raw);
    if (!result) return getDefaultNotifications();

    const notifs: Notification[] = [];
    const stats = result.stats;
    const products = result.products || [];

    if (stats?.return_rate > 10) {
      notifs.push({
        id: "return-spike",
        title: "High return rate detected",
        message: `Your return rate is ${stats.return_rate.toFixed(1)}% — industry avg is 5-7%. Check your product descriptions.`,
        type: "critical",
        time: "Just now",
        read: false,
      });
    }

    if (stats?.roas > 0 && stats?.roas < 2) {
      notifs.push({
        id: "low-roas",
        title: "Ad spend not paying off",
        message: `Your ROAS is ${stats.roas.toFixed(2)}x. Pause ads on low-converting products.`,
        type: "warning",
        time: "Just now",
        read: false,
      });
    }

    const lossMakers = products.filter((p: { profit_margin: number; total_orders: number }) => p.profit_margin < 0 && p.total_orders > 3);
    if (lossMakers.length > 0) {
      notifs.push({
        id: "loss-products",
        title: `${lossMakers.length} product(s) losing money`,
        message: `"${lossMakers[0].name}" has negative margin. Increase price or reduce costs.`,
        type: "critical",
        time: "Just now",
        read: false,
      });
    }

    if (stats?.profit_margin > 0 && stats?.profit_margin < 10) {
      notifs.push({
        id: "thin-margin",
        title: "Overall margin is very thin",
        message: `Your profit margin is ${stats.profit_margin.toFixed(1)}%. Consider bundling products to increase order value.`,
        type: "warning",
        time: "Just now",
        read: false,
      });
    }

    notifs.push({
      id: "daraz-1111",
      title: "Daraz 11.11 in 6 months",
      message: "Start building inventory now. Stock your top 3 products 4 weeks before the event.",
      type: "info",
      time: "Reminder",
      read: true,
    });

    notifs.push({
      id: "weekly-tip",
      title: "Weekly tip",
      message: "Products with 5+ photos get 40% more conversions on Daraz. Check your listings.",
      type: "info",
      time: "This week",
      read: true,
    });

    return notifs.slice(0, 6);
  } catch {
    return getDefaultNotifications();
  }
}

function getDefaultNotifications(): Notification[] {
  return [
    {
      id: "welcome",
      title: "Welcome to ProfitPulse!",
      message: "Upload your Daraz order export from the dashboard to get personalized insights.",
      type: "info",
      time: "Just now",
      read: false,
    },
    {
      id: "daraz-tip",
      title: "Daraz 11.11 coming up",
      message: "Start building inventory now. Top sellers prepare 4 weeks in advance.",
      type: "info",
      time: "Reminder",
      read: true,
    },
    {
      id: "tip-2",
      title: "Pro tip: Upload finance report",
      message: "Upload your Daraz Finance report alongside orders for 100% accurate fee calculations.",
      type: "info",
      time: "This week",
      read: true,
    },
  ];
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userName, setUserName] = useState("Seller");
  const [storeName, setStoreName] = useState("My Store");
  const [userInitials, setUserInitials] = useState("?");

  useEffect(() => {
    setNotifications(generateNotifications());
    async function loadUser() {
      try {
        const { createSupabaseBrowserClient } = await import("../../lib/supabase");
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Seller";
          const store = user.user_metadata?.store_name || "My Store";
          setUserName(name);
          setStoreName(store);
          setUserInitials(name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "?");
        }
      } catch { /* not logged in */ }
    }
    loadUser();
  }, []);

  async function handleSignOut() {
    try {
      const { createSupabaseBrowserClient } = await import("../../lib/supabase");
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    localStorage.removeItem("pp_v4");
    router.push("/");
  }

  const unread = notifications.filter(n => !n.read).length;

  const notifColors = {
    critical: "bg-red-50 dark:bg-red-950 border-l-2 border-red-400",
    warning: "bg-amber-50 dark:bg-amber-950 border-l-2 border-amber-400",
    info: "bg-gray-50 dark:bg-gray-800",
  };

  const notifDot = {
    critical: "bg-red-400",
    warning: "bg-amber-400",
    info: "bg-blue-400",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">ProfitPulse</div>
            <div className="text-[10px] text-gray-400 leading-tight">Daraz Analytics</div>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-medium text-gray-400 px-2 mb-2 mt-1 uppercase tracking-wider">Main</p>
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} onClick={onClose}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
              pathname === href
                ? "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-medium"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}>
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}

        <p className="text-[10px] font-medium text-gray-400 px-2 mb-2 mt-4 uppercase tracking-wider">Account</p>
        <Link href="/settings" onClick={onClose}
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
            pathname === "/settings"
              ? "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-medium"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          )}>
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>

        {/* Notifications */}
        <button onClick={() => setShowNotifs(!showNotifs)}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors w-full text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white">
          <Bell className="w-4 h-4 shrink-0" />
          Notifications
          {unread > 0 && (
            <span className="ml-auto bg-orange-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold shrink-0">
              {unread}
            </span>
          )}
        </button>

        {/* Notifications dropdown */}
        {showNotifs && (
          <div className="mx-1 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 flex items-center justify-between">
              <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Notifications</p>
              {unread > 0 && (
                <button onClick={() => setNotifications(n => n.map(x => ({ ...x, read: true })))}
                  className="text-[10px] text-orange-500 hover:text-orange-600">
                  Mark all read
                </button>
              )}
            </div>
            {notifications.map(n => (
              <div key={n.id}
                className={cn("px-3 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer", notifColors[n.type])}
                onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                <div className="flex items-start gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", notifDot[n.type], n.read && "opacity-30")} />
                  <div className="min-w-0">
                    <p className={cn("text-[11px] font-medium leading-tight", n.read ? "text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-200")}>
                      {n.title}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[9px] text-gray-300 dark:text-gray-600 mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 text-xs font-semibold shrink-0">
            {userInitials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-gray-900 dark:text-white truncate">{userName}</div>
            <div className="text-[10px] text-gray-400 truncate">{storeName}</div>
          </div>
        </div>
        <button onClick={handleSignOut}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors w-full">
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-40 md:hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-sm"
      >
        <Menu className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-200 md:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col h-full">
        <SidebarContent />
      </aside>
    </>
  );
}
