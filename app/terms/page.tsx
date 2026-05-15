import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="border-b border-gray-100 px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center"><span className="text-white text-xs font-bold">PP</span></div>
          <span className="font-semibold text-sm">ProfitPulse</span>
        </Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-16 prose prose-sm dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-gray-500 text-sm">Last updated: May 2025</p>

        <h2>What ProfitPulse is</h2>
        <p>ProfitPulse is an analytics tool for Daraz sellers. It helps you understand your profits, fees, and return rates. It is not affiliated with or endorsed by Daraz.</p>

        <h2>Accuracy of calculations</h2>
        <p>ProfitPulse calculates profit estimates based on Daraz published commission rates and your uploaded data. Actual payouts may differ slightly due to promotions, vouchers, or Daraz policy changes. Always cross-check with your Daraz Finance report for official figures.</p>

        <h2>Free plan limits</h2>
        <p>Free accounts are limited to 1 upload per month and 30 days of order history. Exceeding limits requires a Pro subscription.</p>

        <h2>Prohibited use</h2>
        <p>You may not use ProfitPulse to upload data belonging to a store you do not own or operate.</p>

        <h2>Contact</h2>
        <p>Questions? Email us at hello@profitpulse.pk</p>
      </div>
    </div>
  );
}
