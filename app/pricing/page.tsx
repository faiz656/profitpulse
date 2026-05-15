import Link from "next/link";
import { Check, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₨0",
    period: "/month",
    desc: "For sellers just getting started",
    features: ["1 upload per month", "Last 30 days data", "Basic profit dashboard", "5 AI insights", "CSV & XLSX support"],
    cta: "Get started free",
    href: "/auth/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₨2,499",
    period: "/month",
    desc: "For serious sellers who want real clarity",
    features: ["Unlimited uploads", "Full order history saved", "Real profit with cost prices", "GPT-4 AI insights", "PDF & WhatsApp reports", "Finance file matching", "Email weekly summaries", "Priority WhatsApp support"],
    cta: "Start Pro — 7 days free",
    href: "/auth/signup?plan=pro",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PP</span>
          </div>
          <span className="font-semibold text-sm text-gray-900 dark:text-white">ProfitPulse</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">Sign in</Link>
          <Link href="/auth/signup" className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600">Get started</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">Simple, honest pricing</h1>
          <p className="text-gray-500 dark:text-gray-400">No hidden fees. Pay in Pakistani Rupees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-6 border ${plan.highlight ? "bg-orange-500 border-orange-500" : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"}`}>
              {plan.highlight && (
                <div className="flex items-center gap-1.5 mb-3 text-white">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Most popular</span>
                </div>
              )}
              <h2 className={`text-lg font-semibold mb-1 ${plan.highlight ? "text-white" : "text-gray-900 dark:text-white"}`}>{plan.name}</h2>
              <p className={`text-xs mb-4 ${plan.highlight ? "text-orange-100" : "text-gray-400"}`}>{plan.desc}</p>
              <div className="mb-6">
                <span className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-gray-900 dark:text-white"}`}>{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? "text-orange-100" : "text-gray-400"}`}>{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-orange-500"}`} />
                    <span className={plan.highlight ? "text-orange-50" : "text-gray-600 dark:text-gray-400"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-colors ${plan.highlight ? "bg-white text-orange-600 hover:bg-orange-50" : "bg-orange-500 text-white hover:bg-orange-600"}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">Frequently asked questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: "How do I pay?", a: "JazzCash, EasyPaisa, or credit/debit card. No USD conversion — you pay in PKR." },
              { q: "Is my data safe?", a: "Your data is stored securely on Supabase. We never share it with Daraz or any third party." },
              { q: "Can I cancel anytime?", a: "Yes. Cancel from your settings page. You keep access until end of billing period." },
              { q: "Does it work with my Daraz export?", a: "Yes — export from Seller Center → Orders → All Orders → Export and upload the xlsx file directly." },
              { q: "What if Daraz changes their format?", a: "We monitor Daraz export formats and update within 48 hours of any change." },
              { q: "Do I need an OpenAI key?", a: "No. Basic insights work without any API key. Add your own OpenAI key in settings for GPT-4 analysis." },
            ].map((faq) => (
              <div key={faq.q}>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{faq.q}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Questions? WhatsApp us at{" "}
          <a href="https://wa.me/923001234567" className="text-orange-500 hover:underline">+92 300 1234567</a>
        </p>
      </div>
    </div>
  );
}
