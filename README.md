# ProfitPulse — Daraz Seller Analytics

> Know your real profits after every Daraz fee. Built for Pakistani sellers.

A full-stack SaaS dashboard where Daraz sellers upload their order export and instantly see real profit, fee breakdown, return analysis, and AI-powered business insights.

**GitHub:** [github.com/faiz656/profitpulse](https://github.com/faiz656/profitpulse)

---

## The Problem

Most Daraz sellers think they're making 30-40% margin. After commission (13.3%), shipping, payment fees (2.25%), handling, tax WHT, and returns — the real number is often under 10%.

ProfitPulse shows you the exact number, per product, automatically.

---

## Features

- **Real profit calculation** — Commission + shipping + payment fee + handling + tax WHT + cost price, all deducted automatically
- **CSV/XLSX upload** — Drag and drop your Daraz order export. Supports all column name variations
- **Cost price entry** — Enter what you paid the supplier once. Saved and remembered
- **AI insights** — GPT-4o-mini analyzes your store and tells you exactly what to fix (rule-based fallback when no API key)
- **Product analysis** — Revenue, profit margin, return rate, and health status per product
- **Return analysis** — Which products are being returned most and why it matters
- **Monthly trends** — Revenue vs real profit over time with Recharts
- **PDF export** — One-click PDF report with full breakdown
- **Smart notifications** — Alerts for high return rates, low ROAS, loss-making products
- **Auth** — Email + Google login via Supabase
- **Mobile responsive** — Works on phones with hamburger sidebar

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Auth & Database | Supabase (PostgreSQL + RLS) |
| Charts | Recharts |
| AI | OpenAI GPT-4o-mini |
| PDF | jsPDF |
| File parsing | PapaParse + SheetJS |
| Deployment | Vercel |

---

## How to use with real data

1. Go to **Daraz Seller Center → Orders → All Orders → Export**
2. Download the `.xlsx` file
3. Upload it to ProfitPulse
4. Enter your cost price per product (one time — saved automatically)
5. See your real profit dashboard

A sample file is included: `sample-daraz-export.csv`

---

## Roadmap

- [ ] Finance report reconciliation (match actual Daraz payouts to orders)
- [ ] WhatsApp report sharing
- [ ] Multi-store support
- [ ] Urdu language support
- [ ] Predictive sales forecasting
- [ ] Stripe/JazzCash billing for Pro plan
- [ ] Inventory forecasting

---

## Contributing

PRs welcome. Open an issue first to discuss what you'd like to change.

---

Built for the Pakistani ecommerce market.
Star ⭐ the repo if it helped!
