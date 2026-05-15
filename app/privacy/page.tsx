import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <nav className="border-b border-gray-100 px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center"><span className="text-white text-xs font-bold">PP</span></div>
          <span className="font-semibold text-sm">ProfitPulse</span>
        </Link>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-16 prose prose-sm dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-gray-500 text-sm">Last updated: May 2025</p>

        <h2>Your data stays yours</h2>
        <p>ProfitPulse does not share your order data, product costs, or business information with Daraz, any advertiser, or any third party. Your data is encrypted and stored securely on Supabase infrastructure.</p>

        <h2>What we collect</h2>
        <ul>
          <li>Your email address (for login)</li>
          <li>Your store name (optional, for display)</li>
          <li>Order data you upload (stored to power your dashboard)</li>
          <li>Product cost prices you enter (stored to calculate profit)</li>
        </ul>

        <h2>What we never do</h2>
        <ul>
          <li>We never sell your data</li>
          <li>We never share your data with Daraz</li>
          <li>We never show you ads</li>
          <li>We never access your Daraz account directly</li>
        </ul>

        <h2>Data deletion</h2>
        <p>You can delete your account and all associated data at any time from Settings. Deletion is permanent and immediate.</p>

        <h2>Contact</h2>
        <p>Questions? Email us at privacy@profitpulse.pk or WhatsApp +92 300 1234567</p>
      </div>
    </div>
  );
}
