import Link from "next/link";
import { TrendingUp, Shield, Zap, BarChart3, FileSpreadsheet, Bell, ArrowRight, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">ProfitPulse</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link>
            <Link href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition-colors">How it works</Link>
            <Link href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link href="/auth/signup" className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-orange-100 dark:border-orange-900">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
            Built for Pakistani Daraz Sellers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
            Stop guessing.<br />
            <span className="text-orange-500">Know your real profits.</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your Daraz order export. Enter your cost prices. Instantly see your real profit after every fee — commission, shipping, payment, taxes, and returns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href="/auth/signup" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-600 transition-all hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900 flex items-center gap-2">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors text-sm">
              Try demo first →
            </Link>
          </div>
          <p className="text-xs text-gray-400">No credit card. No Daraz API access needed. Works with any order export.</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-8">
          {[
            { stat: "3,192+", label: "Orders analyzed" },
            { stat: "₨2.4L+", label: "Revenue tracked" },
            { stat: "37%", label: "Avg fees discovered" },
            { stat: "5 min", label: "To first insight" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-semibold text-orange-500">{s.stat}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real profit example */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">What Daraz actually takes from you</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Real example from a Pakistani seller — glass mug sold for ₨1,000</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden max-w-lg mx-auto">
            <div className="bg-orange-500 px-5 py-3 flex items-center justify-between">
              <span className="text-white font-medium text-sm">Sale Price</span>
              <span className="text-white font-semibold">₨1,000</span>
            </div>
            {[
              { label: "Commission (13.3%)", value: "-₨133", color: "text-red-500" },
              { label: "Payment Fee (2.25%)", value: "-₨23", color: "text-red-500" },
              { label: "Shipping Fee", value: "-₨220", color: "text-red-500" },
              { label: "Handling Fee", value: "-₨17", color: "text-red-500" },
              { label: "Tax WHT", value: "-₨30", color: "text-red-500" },
              { label: "Your Cost Price", value: "-₨500", color: "text-purple-500" },
            ].map((row) => (
              <div key={row.label} className="px-5 py-2.5 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
                <span className="text-sm text-gray-500 dark:text-gray-400">{row.label}</span>
                <span className={`text-sm font-medium ${row.color}`}>{row.value}</span>
              </div>
            ))}
            <div className="px-5 py-3 bg-green-50 dark:bg-green-950 flex items-center justify-between">
              <span className="font-semibold text-green-700 dark:text-green-400 text-sm">Real Profit</span>
              <span className="font-bold text-green-700 dark:text-green-400">₨77 (7.7%)</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">ProfitPulse calculates this for every single order automatically</p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: FileSpreadsheet, title: "Export from Daraz", desc: "Go to Seller Center → Orders → All Orders → Export. Download the xlsx file. Takes 30 seconds." },
              { step: "2", icon: BarChart3, title: "Enter your cost prices", desc: "Upload your file. App finds all your products. You enter what you paid the supplier — just once, saved forever." },
              { step: "3", icon: Zap, title: "See your real profit", desc: "Instant dashboard showing real profit per product, fee breakdown, return analysis, and AI recommendations." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-3">Everything you need</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-12">Built specifically for the Pakistani Daraz market</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "₨", title: "Real profit calculation", desc: "Commission, shipping, payment fee, handling, tax WHT, and your cost price — all deducted automatically." },
              { icon: "🤖", title: "AI-powered insights", desc: "GPT-4 analyzes your store and tells you exactly which products are losing money and what to do about it." },
              { icon: "📊", title: "Monthly trends", desc: "See how your profit has changed month by month. Spot seasonal patterns before they hit." },
              { icon: "🔄", title: "Return analysis", desc: "Which products are being returned most? Your return rate vs industry average. Fix before it damages your score." },
              { icon: "📄", title: "PDF reports", desc: "One-tap PDF export. Share with your accountant or team on WhatsApp." },
              { icon: "🔔", title: "Alerts & notifications", desc: "Get notified when return rate spikes, a product goes into loss, or Daraz sale events are coming up." },
              { icon: "💾", title: "Data saved automatically", desc: "Upload once. Cost prices remembered forever. Come back next month and just upload the new file." },
              { icon: "🔒", title: "Your data is private", desc: "Never shared with Daraz. Never sold. Stored encrypted. Delete anytime." },
              { icon: "📱", title: "Works on mobile", desc: "Check your profits from your phone. Designed for Pakistani sellers who run their business on the go." },
            ].map((f) => (
              <div key={f.title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-12">What sellers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Ahmed K.", store: "Khan Electronics, Lahore", text: "I thought I was making 30% margin. ProfitPulse showed me it was actually 8% after all fees. Changed everything about how I price.", stars: 5 },
              { name: "Sara M.", store: "Style House, Karachi", text: "My fashion returns were killing me and I didn't know. The return analysis showed 3 products with 25% return rates. Fixed the descriptions — returns dropped in half.", stars: 5 },
              { name: "Usman B.", store: "TechGadgets PK, Islamabad", text: "The PDF report is what I needed. My accountant now gets a clean monthly report without me having to do anything.", stars: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{t.text}</p>
                <div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.store}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-orange-500">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">Start knowing your real profits today</h2>
          <p className="text-orange-100 mb-8 text-sm">Free to start. No credit card. No Daraz API access. Just upload your export file.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup" className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
              Create free account
            </Link>
            <Link href="/dashboard" className="border border-orange-300 text-white px-8 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors text-sm">
              Try demo first
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white">ProfitPulse</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">Daraz seller analytics for the Pakistani market.</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Product</p>
              <div className="space-y-2">
                {[["Features", "#features"], ["Pricing", "/pricing"], ["Demo", "/dashboard"]].map(([label, href]) => (
                  <Link key={label} href={href} className="block text-xs text-gray-400 hover:text-orange-500 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Company</p>
              <div className="space-y-2">
                {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]].map(([label, href]) => (
                  <Link key={label} href={href} className="block text-xs text-gray-400 hover:text-orange-500 transition-colors">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Support</p>
              <div className="space-y-2">
                <a href="https://wa.me/923001234567" className="block text-xs text-gray-400 hover:text-orange-500 transition-colors">WhatsApp Support</a>
                <a href="mailto:hello@profitpulse.pk" className="block text-xs text-gray-400 hover:text-orange-500 transition-colors">hello@profitpulse.pk</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">© 2025 ProfitPulse. Not affiliated with Daraz.</p>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-gray-300" />
              <p className="text-xs text-gray-400">Your data is never shared with Daraz</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
