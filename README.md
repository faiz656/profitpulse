# ProfitPulse — Daraz Seller Analytics

> Know your real profits after every Daraz fee. Built for Pakistani sellers.

A full-stack SaaS dashboard where Daraz sellers upload their order export and instantly see real profit, fee breakdown, return analysis, and AI-powered business insights.

**Live demo:** [profitpulse.vercel.app](https://profitpulse.vercel.app) *(coming soon)*
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

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/faiz656/profitpulse.git
cd profitpulse
npm install --legacy-peer-deps
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste contents of `supabase-schema.sql` → Run
3. Go to **Settings → API** → copy Project URL and anon key

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your-key   # Optional — rule-based insights work without it
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — try demo data or upload your own Daraz export.

---

## How to use with real data

1. Go to **Daraz Seller Center → Orders → All Orders → Export**
2. Download the `.xlsx` file
3. Upload it to ProfitPulse
4. Enter your cost price per product (one time — saved automatically)
5. See your real profit dashboard

A sample file is included: `sample-daraz-export.csv`

---

## Project Structure

```
profitpulse/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── dashboard/page.tsx        # Main dashboard (upload → cost entry → analytics)
│   ├── analytics/page.tsx        # Monthly trends
│   ├── products/page.tsx         # Product table with search/filter
│   ├── returns/page.tsx          # Return rate analysis
│   ├── insights/page.tsx         # AI insights grouped by severity
│   ├── settings/page.tsx         # Account + notifications + OpenAI key
│   ├── pricing/page.tsx          # Free vs Pro plans
│   ├── auth/                     # Login, signup, forgot password
│   └── api/insights/route.ts     # Server-side AI insights API
├── components/
│   ├── dashboard/                # CSVUploader, ProductCostForm, MetricCard, etc.
│   ├── charts/                   # Recharts wrappers
│   └── layout/Sidebar.tsx        # Sidebar with mobile drawer + notifications
├── lib/
│   ├── csvParser.ts              # Daraz CSV/XLSX parser with fuzzy column matching
│   ├── analytics.ts              # Profit calculation engine
│   ├── aiInsights.ts             # OpenAI + rule-based insights
│   ├── pdf.ts                    # PDF report generator
│   ├── store.ts                  # localStorage analysis cache
│   ├── db.ts                     # Supabase database operations
│   └── supabase.ts               # Supabase client
├── types/index.ts                # TypeScript types + Daraz category rates
├── supabase-schema.sql           # Full DB schema with RLS policies
└── sample-daraz-export.csv       # 314 rows of realistic test data
```

---

## Daraz Fee Structure (built-in)

| Fee | Rate |
|---|---|
| Commission | 8.6% – 18% depending on category |
| Payment fee | 2.25% of sale price |
| Handling fee | ₨17 flat per order |
| Income Tax WHT | ₨10 per order |
| Sales Tax WHT | ₨20 per order |

All 28 Daraz categories with exact commission rates are included in `types/index.ts`.

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
