import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ProfitPulse — Daraz Seller Analytics",
  description: "Know your real Daraz profits after every fee.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
